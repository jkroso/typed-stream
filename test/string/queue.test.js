
var Stream = require('../../string')
  , chai = require('../chai')

var stream
beforeEach(function () {
	stream = new Stream
})

function add(chunk, times){
	while (times--) stream.push(chunk)
}

describe('strings queue', function () {
	describe('.push(x)', function () {
		it('should add items to the internal queue', function () {
			add('a', 5)
			stream.q.should.equal('aaaaa')
		})

		it('should return true if the stream is full', function () {
			stream.max = 2
			stream.push('a').should.be.false
			stream.push('a').should.be.true
		})
	})

	describe('events', function () {
		describe('when adding data', function () {
			it('it should fire a "readable" event', function (done) {
				stream.on('readable', done)
				stream.push('a')
			})

		})

		describe('when reading data', function () {
			it('and not all the available data is read', function () {
				add('a', 2)
				stream.on('readable', function(){
					throw new Error('should not be called')
				})
				stream.read()
			})

			it('should delay the readable notification', function (done) {
				add('a', 2)
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
				add('a', 100)
				stream.read(1)
				stream.read()
			})

			it('should not emit "drain" if it never reaches full', function (done) {
				stream.on('drain', function(){
					done(new Error)
				})
				stream.max = 100
				add('a', 99)
				stream.read()
				setTimeout(done, 0)
			})
		})
	})

	describe('.read()', function () {
		it('should return the whole queue', function () {
			add('a', 3)
			add('b', 2)
			stream.read().should.equal('aaabb')
		})

		it('should remove the data form the queue', function () {
			add('a', 3)
			stream.read().should.equal('aaa')
			add('b', 3)
			stream.read().should.equal('bbb')
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
		it('limit the number of characters read', function () {
			add('a', 5)
			stream.read(2).should.equal('aa')
			stream.should.have.a.lengthOf(3)
		})
	})
})
