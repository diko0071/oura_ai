# Generated by Django 5.0.2 on 2024-06-28 16:22

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0003_analytics_user'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Analytics',
            new_name='GeneratedInsights',
        ),
    ]
