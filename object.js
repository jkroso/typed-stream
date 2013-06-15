
var Stream = require('./base')
  , emitDrain = Stream.emitDrain
  , emitReadable = Stream.emitReadable
  , inherit = require('inherit')
  , defer = require('next-tick')

module.exports = ObjectStream

inherit(ObjectStream, Stream)

/**
 * an Object stream
 *
 * @param {Number} max
 */

function ObjectStream(max){
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

ObjectStream.prototype.push = function(item){
	this.q.push(item)
	this.length++
	this.emit('readable')
	return this.full = this.length >= this.max
}

/**
 * pop one object of the queue
 * @return {Object}
 */

ObjectStream.prototype.read = function(){
	if (!this.length) throw new Error('can\'t read an empty ObjectStream')
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

/**
 * put an object back on the queue
 * @param {Object} item
 */

ObjectStream.prototype.unread = function(item){
	this.q[--this.index] = item
	this.length++
}