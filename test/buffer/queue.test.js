
var Stream = require('../../buffer')
  , chai = require('../chai')

var stream
beforeEach(function () {
	stream = new Stream
})

function add(chunk, times){
	while (times--) stream.push(chunk)
}

describe('buffer stream', function () {
	describe('.push(x)', function () {
		it('should add items to the internal queue', function () {
			add(new Buffer('a'), 5)
			stream.q.should.have.a.lengthOf(5)
		})

		it('should return true if the stream is full', function () {
			stream.max = 2
			stream.push(new Buffer('a')).should.be.false
			stream.push(new Buffer('a')).should.be.true
		})
	})

	describe('events', function () {
		describe('when adding data', function () {
			it('it should fire a "readable" event', function (done) {
				stream.on('readable', done)
				stream.push(new Buffer('a'))
			})
		})

		describe('when reading data', function () {
			it('and not all the available data is read', function () {
				add(new Buffer('a'), 2)
				stream.on('readable', function(){
					throw new Error('should not be called')
				})
				stream.read()
			})

			it('should delay the readable notification', function (done) {
				add(new Buffer('a'), 2)
				stream.on('readable', function(){
					should.exist(async)
					done()
				})
				stream.read(1)
				var async = true
			})

			it('should fire a "drain" event when it falls back within its highwatermark', function (done) {
				stream.on('drain', done)
				stream.max = 100
				add(new Buffer('abc'), 34)
				stream.read(3)
				stream.read()
			})

			it('should not emit "drain" if it never reaches full', function (done) {
				stream.on('drain', function(){
					done(new Error)
				})
				stream.max = 100
				add(new Buffer('a'), 99)
				stream.read()
				setTimeout(done, 0)
			})
		})
	})

	describe('.read()', function () {
		it('should return the whole queue', function () {
			add(new Buffer('a'), 3)
			add(new Buffer('b'), 2)
			stream.read().should.eql(new Buffer('aaabb'))
		})

		describe('on an empty stream', function () {
			it('should cause an error', function () {
				(function () {
					stream.read()
				}).should.throw()
			})
		})
	})

	describe('.read(Number)', function () {
		it('should limit the number of characters read', function () {
			add(new Buffer('a'), 5)
			stream.read(2).should.eql(new Buffer('aa'))
		})

		it('should handle multiple partial reads', function () {
			add(new Buffer('a'), 3)
			add(new Buffer('b'), 2)
			stream.should.have.a.lengthOf(5)
			stream.read(2).should.eql(new Buffer('aa'))
			stream.should.have.a.lengthOf(3)
			stream.read(2).should.eql(new Buffer('ab'))
			stream.read(2).should.eql(new Buffer('b'))
			stream.should.have.a.lengthOf(0)
		})

		it('should handle partial reads with pushes in between', function () {
			add(new Buffer('a'), 3)
			stream.read(2).should.eql(new Buffer('aa'))
			add(new Buffer('b'), 2)
			stream.read(2).should.eql(new Buffer('ab'))
			stream.push(new Buffer('c'))
			stream.read(2).should.eql(new Buffer('bc'))
			stream.should.have.a.lengthOf(0)
		})

		it('should handle multi byte buffers', function () {
			stream.push(new Buffer('abc'))
			stream.push(new Buffer('def'))
			stream.should.have.a.lengthOf(6)
			stream.read(2).should.eql(new Buffer('ab'))
			stream.should.have.a.lengthOf(4)
			stream.read(2).should.eql(new Buffer('cd'))
			stream.should.have.a.lengthOf(2)
			stream.read(2).should.eql(new Buffer('ef'))
			stream.should.have.a.lengthOf(0)
			stream.q.should.eql([])
		})
	})
})
