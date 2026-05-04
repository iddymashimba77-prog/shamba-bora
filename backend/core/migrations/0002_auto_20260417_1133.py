from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [

        migrations.CreateModel(
            name='SensorData',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('soil_moisture', models.FloatField()),
                ('temperature', models.FloatField()),
                ('humidity', models.FloatField()),
                ('ph', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('device', models.ForeignKey(on_delete=models.CASCADE, to='core.device')),
            ],
        ),

        migrations.CreateModel(
            name='Irrigation',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('action', models.CharField(max_length=10)),
                ('status', models.CharField(max_length=20)),
                ('scheduled_time', models.DateTimeField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('farm', models.ForeignKey(on_delete=models.CASCADE, to='core.farm')),
                ('device', models.ForeignKey(on_delete=models.CASCADE, to='core.device')),
            ],
        ),

    ]