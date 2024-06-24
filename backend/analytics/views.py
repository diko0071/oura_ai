from django.shortcuts import render
from rest_framework.response import Response
import requests
import os 
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .services import row_insights_for_metric

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


@api_view(['GET'])
def get_insights_for_metric(request):
    metric = request.query_params.get('metric')
    api = request.query_params.get('api')

    insights = row_insights_for_metric(metric, api)

    return Response(insights)