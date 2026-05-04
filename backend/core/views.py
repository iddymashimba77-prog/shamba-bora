from django.http import JsonResponse
from.models import User
from django.contrib.auth.hashers import check_password
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from .models import Farm

@csrf_exempt
def register_user(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"})

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"})

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    # VALIDATION
    if not name or not email or not password:
        return JsonResponse({"error": "All fields required"})

    # CHECK IF USER EXISTS
    # 🔴 CHECK IF USER EXISTS
    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already exists"})

    try:
        user = User.objects.create(
            name=name,
            email=email,
            password=make_password(password),  # muhimu sana
            phone=phone
        )

        return JsonResponse({
            "status": "success",
            "message": "Registered successfully",
            "user_id": user.id
        })

    except Exception as e:
        return JsonResponse({
            "error": str(e)   # hii itakuonyesha error halisi
        })

from .models import Farm, User
import requests
import math
from datetime import datetime, timedelta

@csrf_exempt
def get_satellite_data(request):
    """Get satellite monitoring data for farms"""
    if request.method == "GET":
        try:
            user_id = request.GET.get('user_id')
            if not user_id:
                return JsonResponse({"error": "user_id required"})
            
            farms = Farm.objects.filter(user_id=user_id)
            satellite_data = []
            
            for farm in farms:
                if farm.latitude and farm.longitude:
                    # Simulate NDVI calculation (in production use real satellite API)
                    ndvi_value = calculate_simulated_ndvi(farm.latitude, farm.longitude)
                    health_status = get_health_status_from_ndvi(ndvi_value)
                    
                    # Get weather data (lightweight API call)
                    weather_info = get_weather_for_location(farm.latitude, farm.longitude)
                    
                    satellite_data.append({
                        "farm_id": farm.id,
                        "farm_name": farm.farm_name,
                        "location": farm.location,
                        "latitude": float(farm.latitude),
                        "longitude": float(farm.longitude),
                        "ndvi": ndvi_value,
                        "health_status": health_status,
                        "weather": weather_info,
                        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "satellite_image_url": get_satellite_image_url(farm.latitude, farm.longitude)
                    })
            
            return JsonResponse({"satellite_data": satellite_data, "status": "success"})
            
        except Exception as e:
            return JsonResponse({"error": str(e)})
    
    return JsonResponse({"error": "Invalid request"})

def calculate_simulated_ndvi(latitude, longitude):
    """Simulate NDVI calculation based on location and time"""
    # Convert Decimal to float if needed
    lat = float(latitude) if hasattr(latitude, 'normalize') else latitude
    lon = float(longitude) if hasattr(longitude, 'normalize') else longitude
    
    # Create realistic NDVI values based on location patterns
    base_ndvi = 0.6  # Base vegetation index
    
    # Add variation based on latitude (vegetation density)
    lat_factor = abs(lat) / 90.0
    ndvi = base_ndvi + (lat_factor * 0.2)
    
    # Add time-based variation (seasonal)
    current_month = datetime.now().month
    if current_month in [3, 4, 5, 6, 7, 8]:  # Growing season
        ndvi += 0.15
    else:
        ndvi -= 0.1
    
    # Add some randomness for realism
    import random
    ndvi += random.uniform(-0.05, 0.05)
    
    # Ensure NDVI stays in valid range (-1 to 1)
    return max(-1, min(1, ndvi))

def get_health_status_from_ndvi(ndvi):
    """Convert NDVI value to health status"""
    if ndvi > 0.6:
        return {"status": "Healthy", "color": "green", "icon": "healthy"}
    elif ndvi > 0.3:
        return {"status": "Moderate", "color": "orange", "icon": "moderate"}
    else:
        return {"status": "Poor", "color": "red", "icon": "poor"}

def get_weather_for_location(latitude, longitude):
    """Get weather data for location (lightweight simulation)"""
    # Convert Decimal to float if needed
    lat = float(latitude) if hasattr(latitude, 'normalize') else latitude
    
    # Simulate weather based on Tanzania climate patterns
    base_temp = 25  # Base temperature for Tanzania
    
    # Adjust temperature based on latitude
    temp_variation = abs(lat - 6.0) * 2
    temperature = base_temp + temp_variation
    
    # Simulate humidity and rainfall
    humidity = 60 + (datetime.now().month % 12) * 3
    rainfall = "moderate" if humidity > 70 else "low"
    
    return {
        "temperature": round(temperature, 1),
        "humidity": min(100, humidity),
        "rainfall": rainfall,
        "condition": "sunny" if humidity < 65 else "cloudy"
    }

def get_satellite_image_url(latitude, longitude):
    """Get satellite image URL for location"""
    # Use OpenStreetMap static image (free and lightweight)
    zoom = 16
    size = "400x400"
    
    return f"https://staticmap.openstreetmap.de/staticmap.php?center={latitude},{longitude}&zoom={zoom}&size={size}&maptype=mapnik&markers={latitude},{longitude},red"

@csrf_exempt
def get_user(request, user_id):
    if request.method == "GET":
        try:
            user = User.objects.get(id=user_id)
            
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(user, 'created_at') and user.created_at else None
            }
            
            return JsonResponse(user_data)
            
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def get_farms(request):
    if request.method == "GET":
        try:
            farms = Farm.objects.all()
            farm_list = []
            
            for farm in farms:
                farm_data = {
                    "id": farm.id,
                    "farm_name": farm.farm_name,
                    "location": farm.location,
                    "farm_type": farm.farm_type,
                    "user_id": farm.user.id if farm.user else None,  # 
                    "created_at": farm.created_at.strftime("%Y-%m-%d %H:%M:%S") if farm.created_at else None
                }
                
                # Add GPS coordinates if available
                if hasattr(farm, 'latitude') and farm.latitude is not None:
                    farm_data["latitude"] = farm.latitude
                if hasattr(farm, 'longitude') and farm.longitude is not None:
                    farm_data["longitude"] = farm.longitude
                    
                farm_list.append(farm_data)
            
            return JsonResponse(farm_list, safe=False)
            
        except Exception as e:
            print("ERROR:", e)
            return JsonResponse({"error": str(e)})
    
    return JsonResponse({"error": "Invalid request"})

@csrf_exempt
def add_farm(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Support both field naming conventions
        name = data.get("farm_name") or data.get("name")
        location = data.get("location")
        farm_type = data.get("farm_type") or data.get("type")
        user_id = data.get("user_id")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if not all([name, location, farm_type, user_id]):
            return JsonResponse({"status": "error", "message": "All fields required"})

        try:
            user = User.objects.get(id=int(user_id)) 

            # Create farm with optional GPS coordinates
            farm_data = {
                "farm_name": name,
                "location": location,
                "farm_type": farm_type,
                "user": user
            }
            
            # Add GPS coordinates if provided
            if latitude is not None and longitude is not None:
                farm_data["latitude"] = latitude
                farm_data["longitude"] = longitude

            Farm.objects.create(**farm_data)

            return JsonResponse({"status": "success"})

        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User not found"})

from .models import Device, Farm

@csrf_exempt
def add_device(request):
    if request.method == "POST":
        data = json.loads(request.body)

        farm = Farm.objects.get(id=data['farm_id'])

        device = Device.objects.create(
            farm=farm,
            device_name=data['device_name'],
            status="active"
        )

        return JsonResponse({"message": "Device added successfully"})
    
    return JsonResponse({"error": "Invalid request"})

from .models import SensorData, Device

@csrf_exempt
def add_sensor_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            device = Device.objects.get(id=data['device_id'])

            sensor = SensorData.objects.create(
                device=device,
                soil_moisture=data['soil_moisture'],
                temperature=data['temperature'],
                humidity=data['humidity'],
                ph=data['ph']
            )

            return JsonResponse({
                "message": "Sensor data added successfully"
            })

        except Exception as e:
            return JsonResponse({"error": str(e)})

    return JsonResponse({"error": "Invalid request"})

from .models import Irrigation, Farm

@csrf_exempt
def control_irrigation(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            farm = Farm.objects.get(id=data['farm_id'])
            device = Device.objects.get(id=data['device_id'])

            irrigation = Irrigation.objects.create(
                farm=farm,
                device=device,
                action=data['action'],
                status=data['status']
            )

            return JsonResponse({
                "message": f"Irrigation turned {data['action']}"
            })

        except Exception as e:
            return JsonResponse({"error": str(e)})
        
def ai_advisor(request):
    try:
        latest = SensorData.objects.latest('created_at')

        advice = ""

        # Soil moisture
        if latest.soil_moisture < 30:
            advice += "Soil is dry. Turn ON irrigation. "

        # Temperature
        if latest.temperature > 30:
            advice += "Temperature is high. Reduce watering time. "

        # pH
        if latest.ph < 5.5:
            advice += "Soil is too acidic. Add lime. "
        elif latest.ph > 7.5:
            advice += "Soil is too alkaline. Add organic matter. "

        # Humidity
        if latest.humidity < 40:
            advice += "Humidity is low. Consider irrigation. "

        if advice == "":
            advice = "Farm conditions are optimal."

        return JsonResponse({
            "advice": advice
        })

    except Exception as e:
        return JsonResponse({"error": str(e)})
    
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email=email)

            if check_password(password, user.password):
                return JsonResponse({
                    "status": "success",
                    "user_id": user.id,
                    "name": user.name,
                    "email": user.email
                })
            else:
                return JsonResponse({"status": "error", "message": "Wrong password"})

        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User not found"})