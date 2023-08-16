from .models import (
    Profile, Academy, AcademyDetails, AcademyFeature, PathInfo,
    Batch, Level, Phase, Subject, Lesson, BatchLink,AcademyType
)
from rest_framework import serializers
from rest_framework.fields import empty
class ProfileSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    class Meta: 
        model = Profile
        fields = "__all__"

class AcademyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyType
        fields = "__all__"

class AcademySerializer(serializers.ModelSerializer):
    # academy_type = serializers.StringRelatedField()
    class Meta:
        model = Academy
        exclude = ('admins', 'dashboard_password', 'academy_type')

class AcademyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyDetails
        fields = "__all__"

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ('id', 'number', 'academy_id')
class BatchLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchLink
        fields = '__all__'
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
        fields = ("id", "number", "title", "exercise_count", "url", "date", "subject", "type_id", "type")
class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademyFeature
        fields = "__all__"
