setup:
	docker volume create frontend_node_modules

install:
	docker compose -f compose.builder.yaml run --rm install

build:
	docker compose -f compose.builder.yaml run --rm build

dev:
	docker compose -f compose.yaml up -d