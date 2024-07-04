# Generated by Django 5.0.2 on 2024-06-26 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='analytics',
            name='dashboard_description',
        ),
        migrations.RemoveField(
            model_name='analytics',
            name='dashboard_name',
        ),
        migrations.AddField(
            model_name='analytics',
            name='generated_insights_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='analytics',
            name='metric',
            field=models.CharField(blank=True, choices=[('daily_activity_score', 'Daily Activity Score'), ('daily_readiness_score', 'Daily Readiness Score'), ('daily_stress_day_summary', 'Daily Stress Day Summary'), ('daily_sleep_score', 'Daily Sleep Score')], max_length=255, null=True),
        ),
    ]