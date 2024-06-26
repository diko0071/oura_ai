from django.db import models

class Analytics(models.Model):
    dashboard_name = models.CharField(max_length=255)
    dashboard_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)