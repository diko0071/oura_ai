from django.shortcuts import render
from rest_framework.response import Response
import requests
import os 
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.decorators import api_view


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
def oura_data(request):
    start_date = '2022-01-01'
    end_date = '2024-12-01'

    sleep_data = get_sleep_data(start_date, end_date)
    readiness_data = get_readiness_data(start_date, end_date)
    stress_data = get_stress_data(start_date, end_date)
    activity_data = get_activity_data(start_date, end_date)
    heart_data = get_heart_data(start_date, end_date)


    return Response({
        'sleep_data': sleep_data,
        'readiness_data': readiness_data,
        'stress_data': stress_data,
        'activity_data': activity_data,
        'heart_data': heart_data
    })