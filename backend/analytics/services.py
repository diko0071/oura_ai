import pandas as pd
import os
import pickle
import requests


directory = "models"

metrics = ['daily_activity_score', 'daily_readiness_score', 'daily_stress_day_summary', 'daily_sleep_score']

api = [
    'daily_sleep',
    'daily_readiness',
    'daily_stress',
    'daily_activity',
]

def get_data(api):
    params={ 
        'start_date': '2021-11-01', 
        'end_date': '2024-12-01' 
    }   

    url = f'https://api.ouraring.com/v2/usercollection/{api}'
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


def aggregate_data(apis):
    combined_df = pd.DataFrame()

    for api in apis:
        data = get_data(api)
        df = pd.DataFrame(data)
        df['day'] = pd.to_datetime(df['day']).dt.date
        df = df.set_index('day')
        df.columns = [f'{api}_{col}' for col in df.columns]
        
        if combined_df.empty:
            combined_df = df
        else:
            combined_df = combined_df.join(df, how='outer')
    
    combined_df = combined_df.reset_index()

    return combined_df


def load_model(metric, directory):
    with open(os.path.join(directory, f'{metric}_model.pkl'), 'rb') as f:
        return pickle.load(f)

def load_models(metrics, directory):
    loaded_models = {}
    for metric in metrics:
        loaded_models[metric + "_model"] = load_model(metric, directory)
    return loaded_models

def compute_feature_importances(models):
    weekly_importances = []

    for week, data in models.items():
        model = data['model']
        X_test = data['X_test']
        
        importances = model.feature_importances_
        feature_importance = pd.DataFrame({'feature': X_test.columns, 'importance': importances, 'week': week})
        weekly_importances.append(feature_importance)
    
    if weekly_importances:
        weekly_importances_df = pd.concat(weekly_importances, ignore_index=True)
        return weekly_importances_df
    else:
        return pd.DataFrame(columns=['feature', 'importance', 'week'])
    

loaded_models = load_models(metrics, directory)

importance_dfs = {metric: compute_feature_importances(model) for metric, model in loaded_models.items()}