from django.shortcuts import render
from rest_framework.response import Response
import requests
import os 
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from analytics.services import load_models, compute_feature_importances, aggregate_data, get_last_week_data

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
def oura_daily_sleep(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_sleep_data(start_date, end_date)


    return Response(sleep_data)


@api_view(['GET'])
def oura_daily_readiness(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_readiness_data(start_date, end_date)


    return Response(sleep_data)

@api_view(['GET'])
def oura_daily_stress(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_stress_data(start_date, end_date)

    return Response(sleep_data)

@api_view(['GET'])
def oura_daily_activity(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_activity_data(start_date, end_date)

    return Response(sleep_data)

@api_view(['GET'])
def oura_heartrate(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_heart_data(start_date, end_date)

    return Response(sleep_data)


api = [
    'daily_sleep',
    'daily_readiness',
    'daily_stress',
    'daily_activity',
]

directory = "ml_models"

metrics = ['daily_activity_score', 'daily_readiness_score', 'daily_stress_day_summary', 'daily_sleep_score']

loaded_models = load_models(metrics, directory)

importance_dfs = {metric: compute_feature_importances(model) for metric, model in loaded_models.items()}


@api_view(['GET'])
def get_last_week_insights(request):
    dataset = aggregate_data(api)

    insights = {metric: get_last_week_data(importance_df, dataset, metric) for metric, importance_df in importance_dfs.items()}

    response_data = {}
    for metric, results in insights.items():
        response_data[metric] = {
            "metric_last_week_values": results['metric_last_week_values'],
            "new_this_week": results['new_this_week'],
            "last_week_values": results['last_week_values'],
            "last_week_top_10": results['last_week_top_10']
        }

    return Response(response_data)
