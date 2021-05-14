
setup_test_env:
	docker-compose -f docker-compose.test.yml build

run_tests:
	docker-compose -f docker-compose.test.yml up --exit-code-from api --abort-on-container-exit

post_run_tests:
	docker-compose -f docker-compose.test.yml down

test: setup_test_env run_tests post_run_tests

.PHONY: test
.PHONY: setup_test_env
.PHONY: run_tests