setup:
	docker volume create backend_node_modules

install:
	docker compose -f compose.builder.yaml run --rm install

dev:
	docker compose -f compose.yaml up -d