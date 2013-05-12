
var Readable = require('stream').Readable

module.exports = Stream

function Stream(){
	Readable.call(this)
	this.setEncoding('utf8')
}

Stream.prototype.__proto__ = Readable.prototype

Stream.prototype._read = function(){}