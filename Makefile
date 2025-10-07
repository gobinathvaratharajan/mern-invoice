build:
	docker compose -f local.yaml up --build -d --remove-orphans

start:
	docker compose -f local.yaml up -d

stop:
	docker compose -f local.yaml down

stop-volumes:
	docker compose -f local.yaml down -v

show-logs:
	docker compose -f local.yaml logs

show-logs-api:
	docker compose -f local.yaml logs api

show-logs-client:
	docker compose -f local.yaml logs client

user:
	docker run --rm mern-invoice_mongodb-data