from django.contrib import admin
from .models import User, Farm, Device, SensorData, Irrigation

# Register your models here.
admin.site.register(User)
admin.site.register(Farm)
admin.site.register(Device)
admin.site.register(SensorData)
admin.site.register(Irrigation)

