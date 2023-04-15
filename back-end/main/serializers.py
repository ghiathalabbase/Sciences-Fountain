from .models import Profile, Academy
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    class Meta: 
        model = Profile
        fields = "__all__"

class AcademySerializer(serializers.ModelSerializer):
    dashboard_password = serializers.CharField(max_length=128, write_only=True)
    class Meta:
        model = Academy
        fields = "__all__"