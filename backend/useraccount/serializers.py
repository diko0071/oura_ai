from rest_framework import serializers
from .models import User
from analytics.tasks import generate_daily_insights
from django_celery_beat.models import PeriodicTask, CrontabSchedule
import json
import logging


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'email', 'openai_key', 'telegram_user_id', 'oura_key',
        )

    def save(self, **kwargs):
        print("UserDetailSerializer save method called")
        
        instance = self.instance
        instance = super().save(**kwargs)
        
        if instance.oura_key:
            schedule, created = CrontabSchedule.objects.get_or_create(
                minute='*',
                hour='11',
                day_of_week='*',
                day_of_month='*',
                month_of_year='*',
            )
            
            PeriodicTask.objects.create(
                crontab=schedule,
                name=f'generate_daily_insights_{instance.id}_for_user_{str(instance.id)}',
                task='generate_daily_insights',
                args=json.dumps([str(instance.id)])
            )

        return instance
    