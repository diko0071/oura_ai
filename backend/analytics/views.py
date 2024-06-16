from django.shortcuts import render
from rest_framework.response import Response
import requests
import os 
from dotenv import load_dotenv
from rest_framework.views import APIView

load_dotenv()

class OuraData(APIView):
    oura_token = os.getenv("OURA_TOKEN")
    headers = { 
        'Authorization': 'Bearer ' + oura_token 
    }
    start_date = '2023-02-01'
    end_date = '2024-06-01'

    def get(self, request):
        url = 'https://api.ouraring.com/v2/usercollection/daily_readiness' 
        headers = { 
            'Authorization': 'Bearer ' + self.oura_token 
        }
        params={ 
            'start_date': self.start_date, 
            'end_date': self.end_date 
        }
        response = requests.request('GET', url, headers=headers, params=params)
        
        return Response(response.json())