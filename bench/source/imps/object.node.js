
var Readable = require('stream').Readable

module.exports = Stream

function Stream(){
	Readable.call(this, {objectMode: true})
}

Stream.prototype.__proto__ = Readable.prototype

Stream.prototype._read = function(){}