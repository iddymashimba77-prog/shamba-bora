from django.urls import path
from .views import register_user, add_farm, get_farms, get_user, add_device, add_sensor_data, control_irrigation, ai_advisor, login_user, get_satellite_data

urlpatterns = [
    path('register/', register_user),

    # USERS
    path('users/<int:user_id>/', get_user),

    # FARMS (GET + POST)
    path('farms/', get_farms),
    path('farms/add/', add_farm),

    # SATELLITE DATA
    path('satellite/', get_satellite_data),

    # DEVICES
    path('add-device/', add_device),

    # SENSOR DATA
    path('sensor-data/', add_sensor_data),

    # 💧 IRRIGATION
    path('irrigation/', control_irrigation),

    # 🤖 AI
    path('ai-advice/', ai_advisor),

    path('login/', login_user),
]