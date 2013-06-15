
var Stream = require('../../object')
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

describe('objects piping spec', function () {
	describe('.pipe()', function () {
		it('should return the destination stream', function () {
			stream.pipe(dest).should.eql(dest)
		})

		it('should send data to the destination automatically', function () {
			stream.pipe(dest)
			stream.push([])
			stream.push({})
			dest.read().should.eql([])
			dest.read().should.eql({})
			dest.should.have.a.lengthOf(0)
		})

		it('should deliver to several destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push([])
			dest.read().should.eql([])
			dest.should.have.a.lengthOf(0)
			b.read().should.eql([])
			b.should.have.a.lengthOf(0)
		})
	})

	describe('.unpipe()', function () {
		it('should prevent more data being sent to the destination', function () {
			stream.pipe(dest)
			stream.push([])
			stream.unpipe(dest)
			stream.push([])
			dest.should.have.a.lengthOf(1)
		})

		it('if there are no pipes left the source should buffer its data again', function () {
			stream.pipe(dest)
			stream.push([])
			stream.unpipe(dest)
			stream.push({})
			stream.read().should.eql({})
		})

		it('should continue to pipe to other destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push({})
			stream.unpipe(b)
			stream.push([])
			dest.read().should.eql({})
			dest.read().should.eql([])
			b.read().should.eql({})
			b.should.have.a.lengthOf(0)
		})
	})
})