REPORTER=dot

serve: node_modules
	@node_modules/serve/bin/serve

test: node_modules
	@node_modules/mocha/bin/_mocha test/*/*.test.js \
		--reporter $(REPORTER) \
		--timeout 100 \
		--check-leaks \
		--bail

node_modules: component.json
	@packin install --meta deps.json,component.json,package.json \
		--folder node_modules \
		--executables \
		--no-retrace

clean:
	rm -r node_modules

bench:
	@bench -i bench/source/imps/string.node,string bench/source/string -c 10
	@bench -i bench/source/imps/object.node,object bench/source/object -c 10
	@bench -i bench/source/imps/buffer.node,buffer bench/source/buffer -c 10

.PHONY: clean serve test bench