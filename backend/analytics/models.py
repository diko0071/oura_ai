from django.db import models
from useraccount.models import User

class InsightsMetrics(models.TextChoices):
    DAILY_ACTIVITY_SCORE = 'daily_activity_score', 'Daily Activity Score'
    DAILY_READINESS_SCORE = 'daily_readiness_score', 'Daily Readiness Score'
    DAILY_STRESS_DAY_SUMMARY = 'daily_stress_day_summary', 'Daily Stress Day Summary'
    DAILY_SLEEP_SCORE = 'daily_sleep_score', 'Daily Sleep Score'

class GeneratedInsights(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    generated_insights_text = models.TextField(null=True, blank=True)
    metric = models.CharField(max_length=255, choices=InsightsMetrics.choices, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Prompts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    system_message = models.TextField()
    user_message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ModelTrainLogs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    last_train_datetime = models.DateTimeField(auto_now_add=True)
    last_train_status = models.TextField(null=True, blank=True)
    last_train_error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)