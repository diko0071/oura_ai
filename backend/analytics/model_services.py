import pandas as pd
import os
import pickle
import requests
import warnings
from datetime import datetime
from sklearn.exceptions import InconsistentVersionWarning
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


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
        
    def get_current_week_data(self, importance_df, without_normalization_df, metric):
        weeks = importance_df['week'].unique()
        last_week = weeks[-2]
        current_week = weeks[-1]
        metric = metric.replace('_model', '')

        current_week_top_10 = importance_df[importance_df['week'] == current_week].sort_values(by='importance', ascending=False).head(10)
        last_week_top_10 = importance_df[importance_df['week'] == last_week].sort_values(by='importance', ascending=False).head(10)

        new_this_week = set(current_week_top_10['feature']) - set(last_week_top_10['feature'])

        current_week_values = without_normalization_df[without_normalization_df['week'] == current_week][current_week_top_10['feature'].tolist() + ['day']].set_index('day').to_dict()
        current_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in current_week_values.items()} 

        metric_current_week_values = without_normalization_df[without_normalization_df['week'] == current_week][[metric, 'day']].set_index('day').to_dict()
        metric_current_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in metric_current_week_values.items()}

        results = {
            'metric_current_week_values': f'{metric} current week values by days: {metric_current_week_values}',
            'new_this_week': f'New features this week: {list(new_this_week)}',
            'current_week_top_10': f'Current week top 10 features and their importantce coefficients: {current_week_top_10.to_dict()}',
            'current_week_values': f'Current week top 10 features mean values: {current_week_values}',
        }
        
        return results
    
    def get_last_week_data(self, importance_df, without_normalization_df, metric):
        weeks = importance_df['week'].unique()
        last_week = weeks[-2]
        last_last_week = weeks[-3]
        metric = metric.replace('_model', '')

        last_week_top_10 = importance_df[importance_df['week'] == last_week].sort_values(by='importance', ascending=False).head(10)
        last_last_week_top_10 = importance_df[importance_df['week'] == last_last_week].sort_values(by='importance', ascending=False).head(10)

        new_last_week = set(last_week_top_10['feature']) - set(last_last_week_top_10['feature'])

        last_week_values = without_normalization_df[without_normalization_df['week'] == last_week][last_week_top_10['feature'].tolist() + ['day']].set_index('day').to_dict()
        last_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in last_week_values.items()} 

        metric_last_week_values = without_normalization_df[without_normalization_df['week'] == last_week][[metric, 'day']].set_index('day').to_dict()
        metric_last_week_values = {str(k): {str(inner_k): inner_v for inner_k, inner_v in v.items()} for k, v in metric_last_week_values.items()}

        results = {
            'metric_last_week_values': f'{metric} last week values by days: {metric_last_week_values}',
            'new_last_week': f'New features last week: {list(new_last_week)}',
            'last_week_top_10': f'Last week top 10 features and their importantce coefficients: {last_week_top_10.to_dict()}',
            'last_week_values': f'Last week top 10 features mean values: {last_week_values}',
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

        consistent_monthly_features = {feature: importance_df[importance_df['feature'] == feature]['importance'].mean() for feature in consistent_monthly_features}

        results = {
            'new_this_month': f'New features this month: {list(new_this_month)}',
            'last_month_top_10': f'Last month top 10 features and their importantce coefficients:: {last_month_top_10.to_dict()}',
            'last_month_values': f'Last month top 10 features mean values: {last_month_values}',
            'consistent_monthly_features': f'Consistent monthly features (appear in last months consistently): {consistent_monthly_features}',
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
            'new_this_3months': f'New features this month: {list(new_this_3months)}',
            'last_3months_top_10': f'Last 3 month top 10 features and their importantce coefficients:: {last_3months_top_10.to_dict()}',
            'last_3months_values': f'Last 3 month top 10 features mean values: {last_3months_values}',
            'consistent_3months_features': f'Consistent 3 month features (appear in 3 last months consistently): {consistent_3months_features}',
        }
        
        return results
    

    def get_row_insights_for_metric(self, metric, api):
        loaded_model = self.load_model(metric)
        aggregated_data = self.aggregate_data(api)

        feature_importances = self.compute_feature_importances(loaded_model)
        
        current_week_insights = self.get_current_week_data(feature_importances, aggregated_data, metric)
        last_week_insights = self.get_last_week_data(feature_importances, aggregated_data, metric)
        last_month_insights = self.get_last_month_data(feature_importances, aggregated_data)
        last_3months_insights = self.get_last_3months_data(feature_importances, aggregated_data)
        
        insights = {
            'current_week': current_week_insights,
            'last_week': last_week_insights,
            'last_month': last_month_insights,
            'last_3months': last_3months_insights
        }

        return insights
    

class TrainUpdateModel:
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

        scaler = StandardScaler()
        
        resulted_df[numeric_columns.columns] = scaler.fit_transform(resulted_df[numeric_columns.columns])

        return resulted_df

    def train_model(self, target, api):
        df = self.aggregate_data(api)

        weeks = df['week'].unique()
        imputer_X = SimpleImputer(strategy='mean')
        imputer_y = SimpleImputer(strategy='mean')
        
        models = {}

        for week in weeks:
            df_week = df[df['week'] == week]
            if df_week.empty:
                continue
            
            X_week = df_week.drop(columns=[target, 'day', 'week'], errors='ignore')
            
            X_week = X_week.select_dtypes(include=[float, int])
            
            if X_week.empty or X_week.shape[0] == 0 or X_week.shape[1] == 0:
                continue
            
            X_week = X_week.dropna(axis=1, how='all')
            imputed_data = imputer_X.fit_transform(X_week)
            X_week = pd.DataFrame(imputed_data, columns=X_week.columns)
            
            y_week = df_week[target]
            if y_week.empty or len(y_week) == 0:
                continue
            
            imputer_y.fit(y_week.values.reshape(-1, 1))
            y_week = pd.Series(imputer_y.transform(y_week.values.reshape(-1, 1)).flatten())
            
            X_train, X_test, y_train, y_test = train_test_split(X_week, y_week, test_size=0.2, random_state=42)
            
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            
            models[week] = {'model': model, 'X_test': X_test, 'y_test': y_test, 'X_columns': X_week.columns}
        
        return models

    def save_model(self, model, metric, api):
        filename = f'{metric}_model.pkl'
        file_path = os.path.join(self.directory, filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
        
        with open(file_path, 'wb') as file:
            pickle.dump(model, file)

    def train_and_save_models(self):
        for metric in self.metrics:
            if metric == 'daily_stress_day_summary':
                continue
            for api in self.api:
                models = self.train_model(metric, api)
                self.save_model(models, metric, api)
        return "Models trained and saved"

    def evaluate_model(self, models):
        weekly_metrics = []

        for week, data in models.items():
            model = data['model']
            X_test = data['X_test']
            y_test = data['y_test']
            
            y_pred = model.predict(X_test)
            
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            weekly_metrics.append({'week': week, 'MSE': mse, 'MAE': mae, 'R2': r2})
    
        return weekly_metrics
