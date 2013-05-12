REPORTER=dot

test:
	@node_modules/mocha/bin/_mocha test/run.js \
		--bail \
		--timeout 100 \
		--reporter $(REPORTER)

bench:
	@bench -i bench/source/imps/string.node,string bench/source/string -c 10
	@bench -i bench/source/imps/object.node,object bench/source/object -c 10
	@bench -i bench/source/imps/buffer.node,buffer bench/source/buffer -c 10

.PHONY: test bench