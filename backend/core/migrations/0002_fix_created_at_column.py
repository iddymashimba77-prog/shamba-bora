from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE core_farm RENAME COLUMN craeted_at TO created_at;",
            reverse_sql="ALTER TABLE core_farm RENAME COLUMN created_at TO craeted_at;"
        ),
    ]