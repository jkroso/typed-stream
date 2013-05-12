
// 0.8125mb of nothing
var data = 'abcdefghijklmnopqrstuvwxyz'
for (var i = 0; i < 15; i++) {
	data += data
}

// before(function(){
// 	console.log((data.length / Math.pow(2, 20)) + 'mb')
// })

var Stream = implementation

run(function(i, done){
	var stream = new Stream
	var buf = ''
	stream.on('readable', function(){
		buf += this.read()
	})
	var i = 0;
	(function write(){
		stream.push(data.slice(i, i + 26))
		if ((i += 26) < data.length) setImmediate(write)
		else done()
	})()
})