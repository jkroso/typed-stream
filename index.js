
function type(obj){
	var t = typeof obj
	if (t == 'object') {
		if (obj instanceof Buffer) return 'buffer'
		return 'object'
	}
	return t
}