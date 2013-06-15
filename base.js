
var Emitter = require('emitter/light')
  , defer = require('next-tick')

module.exports = Stream

/**
 * base class
 */

function Stream(){}

/**
 * mixin emitter
 */
 
Emitter(Stream.prototype)

/**
 * set a connection between the output of `this` and the 
 * input of `dest`
 *
 * @param {Stream} dest
 * @return {Stream} dest
 */

Stream.prototype.pipe = function(dest){
	if (this.pipes) this.pipes.push(dest)
	else {
		this.pipes = [dest]
		this.on('readable', deliver)
	}
	return dest
}

function deliver(){
	var pipes = this.pipes
	var data = this.read()
	for (var i = 0, len = pipes.length; i < len; i++) {
		pipes[i].push(data)
	}
}

/**
 * stop sending data to `dest`
 *
 * @param {Stream} dest
 * @return {this}
 */

Stream.prototype.unpipe = function(dest){
	if (!this.pipes) return this
	this.pipes = this.pipes.filter(function(stream){
		return stream !== dest
	})
	if (!this.pipes.length) {
		delete this.pipes
		this.off('readable', deliver)
	}
	return this
}

/**
 * emit a "drain" event on `self`
 * 
 * @param {Stream} self
 * @api private
 */

Stream.emitDrain = function(self){
	defer(function(){
		self.emit('drain')
	})
}

/**
 * emit a "readable" event on `self` if `self` is still 
 * readable at the end of the current event loop
 * 
 * @param {Stream} self
 * @api private
 */

Stream.emitReadable = function(self){
	defer(function(){
		if (self.length) self.emit('readable')
	})
}