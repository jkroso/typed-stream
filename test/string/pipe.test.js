
var Stream = require('../../string')
  , chai = require('../chai')

var stream
var dest
beforeEach(function () {
	stream = new Stream
	dest = new Stream
})

function add(chunk, times){
	while (times--) stream.push(chunk)
}

describe('strings piping spec', function () {
	describe('.pipe()', function () {
		it('should return the destination stream', function () {
			stream.pipe(dest).should.equal(dest)
		})

		it('should send data to the destination automatically', function () {
			stream.pipe(dest)
			stream.push('a')
			stream.push('bc')
			dest.read().should.equal('abc')
		})

		it('should deliver to several destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push('ab')
			stream.push('cd')
			dest.read().should.equal('abcd')
			b.read().should.equal('abcd')
		})
	})

	describe('.unpipe()', function () {
		it('should prevent more data being sent to the destination', function () {
			stream.pipe(dest)
			stream.push('ab')
			stream.unpipe(dest)
			stream.push('cd')
			dest.read().should.equal('ab')
		})

		it('if there are no pipes left the source should buffer its data again', function () {
			stream.pipe(dest)
			stream.push('ab')
			stream.unpipe(dest)
			stream.push('cd')
			stream.read().should.equal('cd')
		})

		it('should continue to pipe to other destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push('ab')
			stream.unpipe(b)
			stream.push('cd')
			dest.read().should.equal('abcd')
			b.read().should.equal('ab')
		})
	})
})