from django.urls import path
from .views import *

urlpatterns = [
    path('oura/', oura_data, name='oura-data'),
]
