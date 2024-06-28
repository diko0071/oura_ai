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