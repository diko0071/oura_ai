from django.urls import path
from .views import *

urlpatterns = [
    path('oura/daily_sleep/', oura_daily_sleep, name='oura-daily-sleep'),
    path('oura/daily_readiness/', oura_daily_readiness, name='oura-daily-readiness'),
    path('oura/daily_stress/', oura_daily_stress, name='oura-daily-stress'),
    path('oura/daily_activity/', oura_daily_activity, name='oura-daily-activity'),
    path('oura/heartrate/', oura_heartrate, name='oura-heartrate'),
    path('oura/get_last_week_insights/', get_last_week_insights, name='oura-get-last-week-insights'),
]
