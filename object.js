
var Emitter = require('emitter/light')
  , pipeable = require('./pipeable')

/**
 * an Object stream
 *
 * @param {Number} max
 */

function Stream(max){
	this.q = []
	this.index = 0
	this.length = 0
	this.max = max || 100
}

/**
 * add an item to the queue
 * 
 * @param {Object} item
 * @return {Boolean} is full
 */

Stream.prototype.push = function(item){
	this.q.push(item)
	this.length++
	this.emit('readable')
	return this.full = this.length >= this.max
}

/**
 * pop one object of the queue
 * @return {Object}
 */

Stream.prototype.read = function(){
	if (!this.length) throw new Error('can\'t read an empty stream')
	// tidy
	if (this.index == 100) {
		this.q = this.q.slice(100)
		this.index = 0
	}

	var value = this.q[this.index]
	// deref for gc
	this.q[this.index++] = undefined
	if (--this.length) emitReadable(this)
	if (this.full && this.length < this.max) {
		this.full = false
		emitDrain(this)
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
 * @param {Object} item
 */

Stream.prototype.unread = function(item){
	this.q[--this.index] = item
	this.length++
}

// inherit Emitter
Stream.prototype.__proto__ = Emitter.prototype

// mixin pipeable
pipeable(Stream.prototype)

// export the class
module.exports = Stream
