import pandas as pd
import os
import pickle
import requests
import warnings
from datetime import datetime
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

class GenerateRowInsightsModel:
    def __init__(self, directory="ml_models"):
        self.directory = directory
        self.metrics = ['daily_activity_score', 'daily_readiness_score', 'daily_stress_day_summary', 'daily_sleep_score']
        self.api = [
            'daily_sleep',
            'daily_readiness',
            'daily_stress',
            'daily_activity',
        ]

    def get_data(self, api):
        params={ 
            'start_date': '2021-11-01', 
            'end_date': f'{datetime.now().date()}' 
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

    def aggregate_data(self, api):
        combined_df = pd.DataFrame()

        for api in self.api:
            data = self.get_data(api)
            df = pd.DataFrame(data)
            df['day'] = pd.to_datetime(df['day']).dt.date
            df = df.set_index('day')
            df.columns = [f'{api}_{col}' for col in df.columns]
            
            if combined_df.empty:
                combined_df = df
            else:
                combined_df = combined_df.join(df, how='outer')
        
        combined_df = combined_df.reset_index()

        combined_df['week'] = pd.to_datetime(combined_df['day']).dt.isocalendar().week

        columns_to_drop = ['daily_sleep_id', 'daily_sleep_timestamp', 'daily_readiness_id', 
                        'daily_readiness_timestamp', 'daily_stress_id', 'daily_activity_id', 
                        'daily_activity_timestamp', 'daily_activity_met', 'daily_activity_class_5_min']

        resulted_df = combined_df.drop(columns=[col for col in columns_to_drop if col in combined_df.columns])

        resulted_df = resulted_df.dropna(axis=1, how='all')

        numeric_columns = resulted_df.select_dtypes(include=['float64', 'int64'])
        
        resulted_df[numeric_columns.columns] = numeric_columns.fillna(numeric_columns.mean())

        resulted_df['day'] = pd.to_datetime(resulted_df['day'])

        return resulted_df

    def load_model(self, metric):
        with open(os.path.join(self.directory, f'{metric}_model.pkl'), 'rb') as f:
            return pickle.load(f)

    def load_models(self):
        loaded_models = {}
        for metric in self.metrics:
            loaded_models[metric + "_model"] = self.load_model(metric)
        return loaded_models

    def compute_feature_importances(self, models):
        weekly_importances = []

        if isinstance(models, dict):
            models = [models]

        for model_data in models:
            for week, data in model_data.items():
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
        
    def get_last_week_data(self, importance_df, without_normalization_df, metric):
        weeks = importance_df['week'].unique()
        last_week = weeks.max()
        previous_week = weeks[-2] if len(weeks) > 1 else last_week
        metric = metric.replace('_model', '')

        last_week_top_10 = importance_df[importance_df['week'] == last_week].sort_values(by='importance', ascending=False).head(10)
        previous_week_top_10 = importance_df[importance_df['week'] == previous_week].sort_values(by='importance', ascending=False).head(10)

        new_this_week = set(last_week_top_10['feature']) - set(previous_week_top_10['feature'])

        last_week_values = without_normalization_df[without_normalization_df['week'] == last_week][last_week_top_10['feature'].tolist() + ['day']].set_index('day').to_dict()
        last_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in last_week_values.items()} 

        metric_last_week_values = without_normalization_df[without_normalization_df['week'] == last_week][[metric, 'day']].set_index('day').to_dict()
        metric_last_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in metric_last_week_values.items()}

        results = {
            'new_this_week': list(new_this_week),
            'last_week_values': last_week_values,
            'last_week_top_10': last_week_top_10.set_index('feature')['importance'].to_dict(),
            'metric_last_week_values': metric_last_week_values,
        }
        
        return results

    def get_last_month_data(self, importance_df, without_normalization_df):
        weeks = importance_df['week'].unique()
        last_month_weeks = weeks[-4:] if len(weeks) > 4 else weeks

        numeric_columns = without_normalization_df.select_dtypes(include=['float64', 'int64', 'UInt32', 'datetime64[ns]'])

        last_month_top_10 = importance_df[importance_df['week'].isin(last_month_weeks)].groupby('feature')['importance'].mean().sort_values(ascending=False).head(10)
        previous_month_top_10 = importance_df[importance_df['week'].isin(weeks[-8:-4])].groupby('feature')['importance'].mean().sort_values(ascending=False).head(10) if len(weeks) > 8 else last_month_top_10

        new_this_month = set(last_month_top_10.index) - set(previous_month_top_10.index)

        last_month_values = numeric_columns[numeric_columns['week'].isin(last_month_weeks)].drop(columns=['week', 'day']).mean().to_dict()

        consistent_monthly_features = set.intersection(*[set(importance_df[importance_df['week'] == week].sort_values(by='importance', ascending=False).head(20)['feature']) for week in last_month_weeks])

        results = {
            'new_this_month': list(new_this_month),
            'last_month_values': last_month_values,
            'last_month_top_10': last_month_top_10.to_dict(),
            'consistent_monthly_features': {feature: importance_df[importance_df['feature'] == feature]['importance'].mean() for feature in consistent_monthly_features},
        }
        
        return results

    def get_last_3months_data(self, importance_df, without_normalization_df):
        weeks = importance_df['week'].unique()
        last_3months_weeks = weeks[-12:] if len(weeks) > 12 else weeks

        numeric_columns = without_normalization_df.select_dtypes(include=['float64', 'int64', 'UInt32', 'datetime64[ns]'])

        last_3months_top_10 = importance_df[importance_df['week'].isin(last_3months_weeks)].groupby('feature')['importance'].mean().sort_values(ascending=False).head(10)
        previous_3months_top_10 = importance_df[importance_df['week'].isin(weeks[-24:-12])].groupby('feature')['importance'].mean().sort_values(ascending=False).head(10) if len(weeks) > 24 else last_3months_top_10

        new_this_3months = set(last_3months_top_10.index) - set(previous_3months_top_10.index)

        last_3months_values = numeric_columns[numeric_columns['week'].isin(last_3months_weeks)].drop(columns=['week', 'day']).mean().to_dict()

        consistent_3months_features = set.intersection(*[set(importance_df[importance_df['week'] == week].sort_values(by='importance', ascending=False).head(20)['feature']) for week in last_3months_weeks])

        results = {
            'new_this_3months': list(new_this_3months),
            'last_3months_values': last_3months_values,
            'last_3months_top_10': last_3months_top_10.to_dict(),
            'consistent_3months_features': {feature: importance_df[importance_df['feature'] == feature]['importance'].mean() for feature in consistent_3months_features},
        }
        
        return results