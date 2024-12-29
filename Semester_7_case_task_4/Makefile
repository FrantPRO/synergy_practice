#!make
-include .env
.PHONY: prompt prompt_bundle setup

DB_NAME ?= $(DB_NAME)
DB_USER ?= $(DB_USER)
DB_PASSWORD ?= $(DB_PASSWORD)
DB_HOST ?= $(DB_HOST)

setup:
	# Создание роли, если она не существует
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -c "SELECT 1 FROM pg_roles WHERE rolname = '$(DB_USER)';" | grep -q 1 || \
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -c "CREATE ROLE $(DB_USER) WITH LOGIN PASSWORD '$(DB_PASSWORD)';"

	# Создание базы данных, если она не существует
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -c "SELECT 1 FROM pg_database WHERE datname = '$(DB_NAME)';" | grep -q 1 || \
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -c "CREATE DATABASE $(DB_NAME) OWNER $(DB_USER);"

	# Выполнение миграций
	source ~/Projects/SynergyPractice/.venv/bin/activate && \
	alembic -c ~/Projects/SynergyPractice/Semester_7_case_task_4/backend/alembic.ini upgrade head
