
// 32768 empty objects
var data = [{}]
for (var i = 0; i < 15; i++) {
	data = data.concat(data)
}

var Stream = implementation

run(function(i, done){
	var stream = new Stream
	stream.on('readable', function(){
		this.read()
	})
	var i = 0;
	(function write(){
		stream.push(data[i])
		if (++i < data.length) setImmediate(write)
		else done()
	})()
})