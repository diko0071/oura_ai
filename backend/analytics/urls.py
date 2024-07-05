from django.urls import path
from .views import *

urlpatterns = [
    path('oura/daily_sleep_score_for_week/', oura_daily_sleep_score_for_week, name='oura-daily-sleep-score-for-week'),
    path('oura/daily_readiness_score_for_week/', oura_daily_readiness_score_for_week, name='oura-daily-readiness-score-for-week'),
    path('oura/daily_activity_score_for_week/', oura_daily_activity_score_for_week, name='oura-daily-activity-score-for-week'),
    path('oura/heartrate/', oura_heartrate, name='oura-heartrate'),
    path('oura/daily_activity_row_for_week/', oura_daily_activity_row_for_week, name='oura-daily-activity-row-for-week'),
    path('oura/daily_sleep_row_for_week/', oura_daily_sleep_row_for_week, name='oura-daily-sleep-row-for-week'),
    path('oura/daily_readiness_row_for_week/', oura_daily_readiness_row_for_week, name='oura-daily-readiness-row-for-week'),
    path('oura/generate_insights_for_metric/', generate_insights_for_metric, name='oura-generate-insights-for-metric'),
    path('oura/train_models_manually/', train_models_manually_and_get_insights, name='oura-train-models-manually'),
    path('oura/get_generated_insights_for_readiness_for_day/', get_generated_insights_for_readiness_for_day, name='oura-get-generated-insights-for-readiness-for-day'),
    path('oura/get_generated_insights_for_sleep_for_day/', get_generated_insights_for_sleep_for_day, name='oura-get-generated-insights-for-sleep-for-day'),
    path('oura/get_generated_insights_for_activity_for_day/', get_generated_insights_for_activity_for_day, name='oura-get-generated-insights-for-activity-for-day'),
]