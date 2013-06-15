
var Stream = require('../../object')
  , chai = require('../chai')

var stream
beforeEach(function () {
	stream = new Stream
})

function add(chunk, times){
	while (times--) stream.push(chunk)
}

describe('objects', function () {
	describe('.push(x)', function () {
		it('should add items to the internal queue', function () {
			stream.push(1)
			stream.push(2)
			stream.push(3)
			stream.q.should.deep.equal([1,2,3])
		})

		it('should return true if the stream is full', function () {
			stream.max = 2
			stream.push({}).should.be.false
			stream.push({}).should.be.true
		})
	})

	describe('events', function () {
		describe('when adding data', function () {
			it('it should fire a "readable" event', function (done) {
				stream.on('readable', done)
				stream.push({})
			})
		})

		describe('when reading data', function () {
			it('and not all the available data is read', function (done) {
				add({}, 2)
				stream.on('readable', done)
				stream.read()
			})

			it('should delay the readable notification', function (done) {
				add({}, 2)
				stream.on('readable', function(){
					should.exist(async)
					done()
				})
				stream.read()
				var async = true
			})

			it('should fire a "drain" event when it falls back within its highwatermark', function (done) {
				stream.on('drain', done)
				stream.max = 100
				add({}, 100)
				stream.read(1)
				stream.read()
			})

			it('should not emit "drain" if it never reaches full', function (done) {
				stream.on('drain', function(){
					done(new Error)
				})
				stream.max = 100
				add({}, 99)
				stream.read()
				setTimeout(done, 0)
			})
		})
	})

	describe('.read()', function () {
		it('should work pop out the first item', function () {
			var data = [[],{},[]]
			data.forEach(function(o){
				stream.push(o)
			})
			data.forEach(function(o, i){
				stream.read().should.equal(data[i])
			})
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
		it('should be ignored', function () {
			add({}, 5)
			stream.read(2).should.deep.equal({})
		})
	})
})

