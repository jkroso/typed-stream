
var Stream = BufferStream

var stream
var dest
beforeEach(function () {
	stream = new Stream
	dest = new Stream
})

function add(chunk, times){
	while (times--) stream.push(chunk)
}

describe('buffers piping spec', function () {
	describe('.pipe()', function () {
		it('should return the destination stream', function () {
			stream.pipe(dest).should.eql(dest)
		})

		it('should send data to the destination automatically', function () {
			stream.pipe(dest)
			stream.push(new Buffer('ab'))
			stream.push(new Buffer('c'))
			dest.read().should.eql(new Buffer('abc'))
		})

		it('should deliver to several destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push(new Buffer('ab'))
			stream.push(new Buffer('cd'))
			dest.read().should.eql(new Buffer('abcd'))
			b.read().should.eql(new Buffer('abcd'))
		})
	})

	describe('.unpipe()', function () {
		it('should prevent more data being sent to the destination', function () {
			stream.pipe(dest)
			stream.push(new Buffer('ab'))
			stream.unpipe(dest)
			stream.push(new Buffer('cd'))
			dest.read().should.eql(new Buffer('ab'))
		})

		it('if there are no pipes left the source should buffer its data again', function () {
			stream.pipe(dest)
			stream.push(new Buffer('ab'))
			stream.unpipe(dest)
			stream.push(new Buffer('cd'))
			stream.read().should.eql(new Buffer('cd'))
		})

		it('should continue to pipe to other destinations', function () {
			var b = new Stream
			stream.pipe(dest)
			stream.pipe(b)
			stream.push(new Buffer('ab'))
			stream.unpipe(b)
			stream.push(new Buffer('cd'))
			dest.read().should.eql(new Buffer('abcd'))
			b.read().should.eql(new Buffer('ab'))
		})
	})
})