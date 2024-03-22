from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class endpoint(APIView):
    def get(self, request):
        return Response({'mesage': 'Al kevin le gustan los endPoints'})
    
# Create your views here.
