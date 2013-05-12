
var Emitter = require('emitter/light')
  , pipeable = require('./pipeable')

/**
 * a String stream
 *
 * @param {Number} max
 */

function Stream(max){
	this.q = ''
	this.length = 0
	this.max = max || 100
}

/**
 * add an item to the queue
 * 
 * @param {String} str
 * @return {Boolean} is full
 */

Stream.prototype.push = function(str){
	this.q += str
	this.length += str.length
	this.emit('readable')
	return this.full = this.length >= this.max
}

/**
 * read data of the queue. pass an Int for `n` if
 * you want to set a limit on how many characters
 * will be read 
 * 
 * @param {Int} [n=Infinity]
 * @return {String}
 */

Stream.prototype.read = function(n){
	if (!this.length) throw new Error('can\'t read an empty stream')
	var value = this.q
	if (n === undefined || n >= this.length) {
		this.q = ''
		this.length = 0
		if (this.full) this.full = false, emitDrain(this)
	} else {
		this.q = value.slice(n)
		value = value.slice(0, n)
		if (this.length -= n) emitReadable(this)
		if (this.full && this.length < this.max) {
			this.full = false
			emitDrain(this)
		}
	}
	return value
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
 * put an object back on the queue
 * @param {String} str
 */

Stream.prototype.unread = function(str){
	this.q = str + this.q
	this.length = this.q.length
}

// inherit from Emitter
Stream.prototype.__proto__ = Emitter.prototype

// mixin pipeable
pipeable(Stream.prototype)

// export the class
module.exports = Stream
