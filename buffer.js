
var Emitter = require('emitter/light')
  , pipeable = require('./pipeable')
  , concat = Buffer.concat

/**
 * an Object stream
 *
 * @param {Number} max
 */

function Stream(max){
	this.q = []
	this.length = 0
	this.max = max || 100
}

/**
 * add an item to the queue
 * 
 * @param {Buffer} item
 * @return {Boolean} is full
 */

Stream.prototype.push = function(buf){
	this.q.push(buf)
	this.length += buf.length
	this.emit('readable')
	return this.full = this.length >= this.max
}

/**
 * read `n` bytes of the queue. pass an Int for `n` to
 * limit the number of bytes you want to receive
 * 
 * @param {Int} [n=Infinity]
 * @return {Buffer}
 */

Stream.prototype.read = function(n){
	if (!this.length) throw new Error('can\'t read an empty stream')
	var q = this.q
	// read all
	if (n === undefined || n > this.length) {
		var chunk = concat(q, this.length)
		q.length = this.index = this.length = 0
		if (this.full) {
			this.full = false
			emitDrain(this)
		}
		return chunk
	}

	var i = 0
	var bufs = []
	var size = 0
	
	// read to `n`
	do {
		var chunk = q[i]
		size += chunk.length
		// partial chunk
		if (size > n) {
			var cut = chunk.length - (size - n)
			q[i] = chunk.slice(cut)
			bufs.push(chunk.slice(0, cut))
			break
		}
		bufs.push(chunk)
		i++
	} while (size < n)

	this.q = q.slice(i)
	if (this.length -= n) emitReadable(this)
	if (this.full && this.length < this.max) {
		this.full = false
		emitDrain(this)
	}
	return concat(bufs, n)
}

function emitDrain(self){
	setImmediate(function(){
		self.emit('drain')
	})
}

function emitReadable(self){
	setImmediate(function(){
		if (self.length) self.emit('readable')
	})
}

/**
 * put a buffer back on the queue
 * @param {Buffer} buf
 */

Stream.prototype.unread = function(buf){
	this.q.unshift(buf)
	this.length += buf.length
}

// inherit Emitter
Stream.prototype.__proto__ = Emitter.prototype

// mixin pipeable
pipeable(Stream.prototype)

// export the class
module.exports = Stream