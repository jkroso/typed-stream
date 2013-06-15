
var Stream = require('./base')
  , emitDrain = Stream.emitDrain
  , emitReadable = Stream.emitReadable
  , inherit = require('inherit')
  , defer = require('next-tick')

module.exports = StringStream

inherit(StringStream, Stream)

/**
 * a String stream
 *
 * @param {Number} max
 */

function StringStream(max){
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

StringStream.prototype.push = function(str){
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

StringStream.prototype.read = function(n){
	if (!this.length) throw new Error('can\'t read an empty StringStream')
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

/**
 * put an object back on the queue
 * @param {String} str
 */

StringStream.prototype.unread = function(str){
	this.q = str + this.q
	this.length = this.q.length
}
