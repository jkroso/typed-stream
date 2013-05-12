
var Readable = require('stream').Readable

module.exports = Stream

function Stream(){
	Readable.call(this)
}

Stream.prototype.__proto__ = Readable.prototype

Stream.prototype._read = function(){}