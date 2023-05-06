from .models import (
    Profile, Academy, AcademyDetail, AcademyFeature, PathInfo,
    Batch, Level, Phase, Subject, Lesson
)
from rest_framework import serializers
from rest_framework.fields import empty
class ProfileSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    class Meta: 
        model = Profile
        fields = "__all__"

class AcademySerializer(serializers.ModelSerializer):
    class Meta:
        model = Academy
        exclude = ('admins', 'dashboard_password')

class AcademyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyDetail
        fields = "__all__"

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ('id', 'number', 'academy_id')
    
class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ('id', 'number', 'batch_id')
    
class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = ('id', 'number', 'level_id')
    

class PathInfoSerializer(serializers.ModelSerializer):
    batch = BatchSerializer()
    level = LevelSerializer()
    phase = PhaseSerializer()
    class Meta:
        model = PathInfo
        fields = ('id','academy_id', 'batch', 'level', 'phase')

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"

class LessonSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    class Meta:
        model = Lesson
        fields = "__all__"

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyFeature
        fields = "__all__"
