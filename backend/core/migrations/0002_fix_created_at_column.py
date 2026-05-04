from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_fix_created_at_column'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE core_farm ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6) NULL;",
            reverse_sql="ALTER TABLE core_farm DROP COLUMN IF EXISTS latitude;"
        ),
        migrations.RunSQL(
            "ALTER TABLE core_farm ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6) NULL;",
            reverse_sql="ALTER TABLE core_farm DROP COLUMN IF EXISTS longitude;"
        ),
    ]
