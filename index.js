// WIP

module.exports = DynamicStream

/**
 * dynamic stream. decides its type on first `push`
 */

function DynamicStream(){}

DynamicStream.string = require('./string')
DynamicStream.object = require('./object')
DynamicStream.buffer = require('./buffer')

function type(obj){
	var t = typeof obj
	if (t == 'object') {
		if (obj instanceof Buffer) return 'buffer'
		return 'object'
	}
	return t
}