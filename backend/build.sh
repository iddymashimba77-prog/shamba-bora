#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py shell -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('ALTER TABLE core_farm ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6) NULL;')
cursor.execute('ALTER TABLE core_farm ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6) NULL;')
print('Columns added successfully!')
"
