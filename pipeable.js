
exports = module.exports = function(obj){
	for (var k in exports) obj[k] = exports[k]
}

/**
 * set a connection between the output of `this` and the 
 * input of `dest`
 *
 * @param {Stream} dest
 * @return {Stream} dest
 */

exports.pipe = function(dest){
	if (this.pipes) this.pipes.push(dest)
	else {
		this.pipes = [dest]
		this.on('readable', deliver)
	}
	return dest
}

function deliver(){
	var pipes = this.pipes
	var data = this.read()
	for (var i = 0, len = pipes.length; i < len; i++) {
		pipes[i].push(data)
	}
}

/**
 * stop sending data to `dest`
 *
 * @param {Stream} dest
 * @return {this}
 */

exports.unpipe = function(dest){
	if (!this.pipes) return this
	this.pipes = this.pipes.filter(function(stream){
		return stream !== dest
	})
	if (!this.pipes.length) {
		delete this.pipes
		this.off('readable', deliver)
	}
	return this
}