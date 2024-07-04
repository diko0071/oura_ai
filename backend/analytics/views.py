from django.shortcuts import render
from rest_framework.response import Response
import requests
import os 
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .services import openai_call
from .prompts import get_ai_insgihts_for_metric_prompt, oura_metrics_definition_daily_activity_score, oura_metrics_definition_daily_sleep_score, oura_metrics_definition_daily_readiness_score
from .model_services import GenerateRowInsightsModel, TrainUpdateModel
from .models import GeneratedInsights, ModelTrainLogs
from .serializers import GeneratedInsightsSerializer
from datetime import datetime, timedelta
import json

model = GenerateRowInsightsModel()

update_train_model = TrainUpdateModel()

load_dotenv()


def get_sleep_data(start_date, end_date):

    api = 'daily_sleep'

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
    params={ 
        'start_date': start_date, 
        'end_date': end_date 
    }
    headers = { 
        'Authorization': f'Bearer {os.getenv("OURA_TOKEN")}' 
    }
    response = requests.request('GET', url, headers=headers, params=params)

    data = response.json()['data']

    rows = []

    for item in data: 
        row = item.copy()

        if 'contributors' in item:
            row.update(item['contributors'])
            del row['contributors']
        
        rows.append(row)
    
    return rows

def get_readiness_data(start_date, end_date):

    api = 'daily_readiness'

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
    params={ 
        'start_date': start_date, 
        'end_date': end_date 
    }
    headers = { 
        'Authorization': f'Bearer {os.getenv("OURA_TOKEN")}' 
    }
    response = requests.request('GET', url, headers=headers, params=params)

    data = response.json()['data']

    rows = []

    for item in data: 
        row = item.copy()

        if 'contributors' in item:
            row.update(item['contributors'])
            del row['contributors']
        
        rows.append(row)
    
    return rows


def get_stress_data(start_date, end_date):

    api = 'daily_stress'

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
    params={ 
        'start_date': start_date, 
        'end_date': end_date 
    }
    headers = { 
        'Authorization': f'Bearer {os.getenv("OURA_TOKEN")}' 
    }
    response = requests.request('GET', url, headers=headers, params=params)

    data = response.json()['data']

    rows = []

    for item in data: 
        row = item.copy()

        if 'contributors' in item:
            row.update(item['contributors'])
            del row['contributors']
        
        rows.append(row)
    
    return rows

def get_activity_data(start_date, end_date):

    api = 'daily_activity'

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
    params={ 
        'start_date': start_date, 
        'end_date': end_date 
    }
    headers = { 
        'Authorization': f'Bearer {os.getenv("OURA_TOKEN")}' 
    }
    response = requests.request('GET', url, headers=headers, params=params)

    data = response.json()['data']

    rows = []

    for item in data: 
        row = item.copy()

        if 'contributors' in item:
            row.update(item['contributors'])
            del row['contributors']
        
        rows.append(row)
    
    return rows

def get_heart_data(start_date, end_date):

    api = 'heartrate'

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
    params={ 
        'start_date': start_date, 
        'end_date': end_date 
    }
    headers = { 
        'Authorization': f'Bearer {os.getenv("OURA_TOKEN")}' 
    }
    response = requests.request('GET', url, headers=headers, params=params)

    data = response.json()['data']

    rows = []

    for item in data: 
        row = item.copy()

        if 'contributors' in item:
            row.update(item['contributors'])
            del row['contributors']
        
        rows.append(row)
    
    return rows

@api_view(['GET'])
def oura_daily_activity_row_for_week(request):

    end_date = datetime.today().strftime('%Y-%m-%d')

    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    activity_data = get_activity_data(start_date, end_date)

    transformed_data = {
        'days': [item['day'] for item in activity_data],
        'score': [item['score'] for item in activity_data],
        'active_calories': [item['active_calories'] for item in activity_data],
        'average_met_minutes': [item['average_met_minutes'] for item in activity_data],
        'equivalent_walking_distance': [item['equivalent_walking_distance'] for item in activity_data],
        'high_activity_met_minutes': [item['high_activity_met_minutes'] for item in activity_data],
        'high_activity_time': [item['high_activity_time'] for item in activity_data],
        'inactivity_alerts': [item['inactivity_alerts'] for item in activity_data],
        'low_activity_met_minutes': [item['low_activity_met_minutes'] for item in activity_data],
        'low_activity_time': [item['low_activity_time'] for item in activity_data],
        'medium_activity_met_minutes': [item['medium_activity_met_minutes'] for item in activity_data],
        'medium_activity_time': [item['medium_activity_time'] for item in activity_data],
        'meters_to_target': [item['meters_to_target'] for item in activity_data],
        'non_wear_time': [item['non_wear_time'] for item in activity_data],
        'resting_time': [item['resting_time'] for item in activity_data],
        'sedentary_met_minutes': [item['sedentary_met_minutes'] for item in activity_data],
        'sedentary_time': [item['sedentary_time'] for item in activity_data],
        'steps': [item['steps'] for item in activity_data],
        'target_calories': [item['target_calories'] for item in activity_data],
        'target_meters': [item['target_meters'] for item in activity_data],
        'total_calories': [item['total_calories'] for item in activity_data],
        'timestamp': [item['timestamp'] for item in activity_data],
        'meet_daily_targets': [item['meet_daily_targets'] for item in activity_data],
        'move_every_hour': [item['move_every_hour'] for item in activity_data],
        'recovery_time': [item['recovery_time'] for item in activity_data],
        'stay_active': [item['stay_active'] for item in activity_data],
        'training_frequency': [item['training_frequency'] for item in activity_data],
        'training_volume': [item['training_volume'] for item in activity_data],
        'metric': 'Daily Readiness Score'
    }

    return Response(transformed_data)

@api_view(['GET'])
def oura_daily_sleep_row_for_week(request):

    end_date = datetime.today().strftime('%Y-%m-%d')
    
    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    sleep_data = get_sleep_data(start_date, end_date)

    transformed_data = {
        'days': [item['day'] for item in sleep_data],
        'scores': [item['score'] for item in sleep_data],
        'deep_sleep': [item['deep_sleep'] for item in sleep_data],
        'efficiency': [item['efficiency'] for item in sleep_data],
        'latency': [item['latency'] for item in sleep_data],
        'rem_sleep': [item['rem_sleep'] for item in sleep_data],
        'restfulness': [item['restfulness'] for item in sleep_data],
        'timing': [item['timing'] for item in sleep_data],
        'total_sleep': [item['total_sleep'] for item in sleep_data],
        'metric': 'Daily Sleep Score'
    }
    return Response(transformed_data)



@api_view(['GET'])
def oura_daily_readiness_row_for_week(request):

    end_date = datetime.today().strftime('%Y-%m-%d')
    
    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    readiness_data = get_readiness_data(start_date, end_date)

    transformed_data = {
        'days': [item['day'] for item in readiness_data],
        'scores': [item['score'] for item in readiness_data],
        'temperature_deviation': [item['temperature_deviation'] for item in readiness_data],
        'temperature_trend_deviation': [item['temperature_trend_deviation'] for item in readiness_data],
        'activity_balance': [item['activity_balance'] for item in readiness_data],
        'body_temperature': [item['body_temperature'] for item in readiness_data],
        'hrv_balance': [item['hrv_balance'] for item in readiness_data],
        'previous_day_activity': [item['previous_day_activity'] for item in readiness_data],
        'previous_night': [item['previous_night'] for item in readiness_data],
        'recovery_index': [item['recovery_index'] for item in readiness_data],
        'resting_heart_rate': [item['resting_heart_rate'] for item in readiness_data],
        'sleep_balance': [item['sleep_balance'] for item in readiness_data],
        'metric': 'Daily Readiness Score'
    }

    return Response(transformed_data)

@api_view(['GET'])
def oura_daily_readiness_score_for_week(request):
    end_date = datetime.today().strftime('%Y-%m-%d')
    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    readiness_data = get_readiness_data(start_date, end_date)

    transformed_data = {
        'days': [item['day'] for item in readiness_data],
        'scores': [item['score'] for item in readiness_data],
        'metric': 'Daily Readiness Score'
    }

    return Response(transformed_data)


@api_view(['GET'])
def oura_daily_sleep_score_for_week(request):
    end_date = datetime.today().strftime('%Y-%m-%d')
    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    sleep_data = get_sleep_data(start_date, end_date)


    transformed_data = {
        'days': [item['day'] for item in sleep_data],
        'scores': [item['score'] for item in sleep_data],
        'metric': 'Daily Sleep Score'
    }

    return Response(transformed_data)

@api_view(['GET'])
def oura_daily_activity_score_for_week(request):
    end_date = datetime.today().strftime('%Y-%m-%d')
    start_date = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')

    activity_data = get_activity_data(start_date, end_date)


    transformed_data = {
        'days': [item['day'] for item in activity_data],
        'scores': [item['score'] for item in activity_data],
        'metric': 'Daily Activity Score'
    }

    return Response(transformed_data)

@api_view(['GET'])
def oura_heartrate(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_heart_data(start_date, end_date)

    return Response(sleep_data)

@api_view(['GET'])
def generate_insights_for_metric(request):

    api = request.data.get('api')

    metric = f'{api}_score'

    insights = model.get_row_insights_for_metric(metric, api)

    definition_var_name = f'oura_metrics_definition_{metric}'
    
    definition = globals().get(definition_var_name, None)

    if definition is None:
        definition = ''

    ai_insights = openai_call(human_message=f'Key metric you MUST provide insights for: {metric}.\n\nAdditional context data: {str(insights)}', system_message = get_ai_insgihts_for_metric_prompt + definition, user = request.user)
    
    generated_insight = GeneratedInsights.objects.create(
        user=request.user,
        generated_insights_text=ai_insights,
        metric=metric
    )

    serializer = GeneratedInsightsSerializer(generated_insight)

    return Response(serializer.data)


@api_view(['POST'])
def train_models_manually(request):
    try:
        update_train_model.train_and_save_models()

        trained_model = ModelTrainLogs.objects.create(
            user=request.user,
            last_train_datetime=datetime.now(),
            last_train_status='success'
        )
        return Response({'message': 'Model trained'})
    except Exception as e:
        
        trained_model = ModelTrainLogs.objects.create(
            user=request.user,
            last_train_datetime=datetime.now(),
            last_train_status='error',
            last_train_error=str(e)
        )
        return Response({'message': 'Error training model'})


@api_view(['GET'])
def get_generated_insights_for_readiness_for_day(request):
    date = request.query_params.get('date')
    data = GeneratedInsights.objects.filter(
        user=request.user, 
        metric='daily_readiness_score',
        created_at__date=date
    )

    serializer = GeneratedInsightsSerializer(data, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def get_generated_insights_for_sleep_for_day(request):
    date = request.query_params.get('date')
    data = GeneratedInsights.objects.filter(
        user=request.user, 
        metric='daily_sleep_score',
        created_at__date=date
    )

    serializer = GeneratedInsightsSerializer(data, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def get_generated_insights_for_activity_for_day(request):
    date = request.query_params.get('date')
    data = GeneratedInsights.objects.filter(
        user=request.user, 
        metric='daily_activity_score',
        created_at__date=date
    )

    serializer = GeneratedInsightsSerializer(data, many=True)

    return Response(serializer.data)

