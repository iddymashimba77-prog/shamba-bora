from django.db import models

# User
class User(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=45)
    password = models.CharField(max_length=255)
    ceated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
# Farm
class Farm(models.Model):
   farm_name = models.CharField(max_length=100)
   location = models.CharField(max_length=100)
   farm_type = models.CharField(max_length=50)
   created_at = models.DateTimeField(auto_now_add=True)
   user = models.ForeignKey(User, on_delete=models.CASCADE)
   latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
   longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
  

   def __str__(self):
        return self.farm_name
    
# Device
class Device(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    device_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.device_name
    
# Sensor Data
class SensorData(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    soil_moisture = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sensor {self.device.device_name}"
    
# Irrigation
class Irrigation(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    action = models.CharField(max_length=10)  # ON / OFF
    status = models.CharField(max_length=20)  # pending / done

    scheduled_time = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.device.device_name}"
    
