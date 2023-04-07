from .models import Profile
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    class Meta: 
        model = Profile
        fields = "__all__"