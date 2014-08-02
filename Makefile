
TESTS = $(shell find test/*.js)

test:
	@./test/run $(TESTS)

.PHONY: test