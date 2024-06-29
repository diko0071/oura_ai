from celery import shared_task
from django.utils.timezone import now
from django.utils import timezone
import calendar
from django_celery_beat.models import PeriodicTask, PeriodicTasks, CrontabSchedule
from datetime import datetime
import os
import requests
from .model_services import TrainUpdateModel, GenerateRowInsightsModel
from .services import openai_call
from .prompts import get_ai_insgihts_for_metric_prompt, oura_metrics_definition_daily_activity_score, oura_metrics_definition_daily_sleep_score, oura_metrics_definition_daily_readiness_score
from .models import GeneratedInsights



@shared_task(name='train_models')
def train_models():
    model = TrainUpdateModel()

    model.train_and_save_models()

    return "Models trained and saved"


@shared_task(name='generate_daily_insights')
def generate_daily_insights(user_id):
    from useraccount.models import User
    
    user = User.objects.get(id=user_id)
    model = GenerateRowInsightsModel()

    api = [
        'daily_sleep',
        'daily_readiness',
        'daily_activity',
    ]

    definition = ''

    for api in api:
        metric = f'{api}_score'
        insights = model.get_row_insights_for_metric(metric, api)

        definition_var_name = f'oura_metrics_definition_{metric}'
        
        definition = globals().get(definition_var_name, '')

        if definition is None:
            definition = ''

        ai_insights = openai_call(human_message=f'Key metric you MUST provide insights for: {metric}.\n\nAdditional context data: {str(insights)}', system_message = get_ai_insgihts_for_metric_prompt + definition, user = user)
    
        generated_insight = GeneratedInsights.objects.create(
            user=user,
            generated_insights_text=ai_insights,
            metric=metric
        )

    return "Daily insights generated"
