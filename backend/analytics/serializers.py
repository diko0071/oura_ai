from rest_framework import serializers
from .models import GeneratedInsights
from useraccount.models import User 

class GeneratedInsightsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = GeneratedInsights
        fields = '__all__'