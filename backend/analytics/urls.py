from django.urls import path
from .views import *

urlpatterns = [
    path('oura/daily_readiness/', OuraData.as_view(), name='oura-daily-readiness'),
]
