#!/bin/bash

echo "Waiting for database..."
while ! pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done

echo "Database is ready!"
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000