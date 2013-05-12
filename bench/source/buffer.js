
// 0.8125mb of nothing
var data = 'abcdefghijklmnopqrstuvwxyz'
for (var i = 0; i < 15; i++) {
	data += data
}
data = new Buffer(data)

var Stream = implementation

run(function(i, done){
	var stream = new Stream
	var bufs = []
	stream.on('readable', function(){
		bufs.push(this.read())
	})
	var i = 0;
	(function write(){
		stream.push(data.slice(i, i + 26))
		if ((i += 26) < data.length) setImmediate(write)
		else done()
	})()
})