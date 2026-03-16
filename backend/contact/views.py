from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Contact
from .serializers import ContactSerializer

class ContactView(APIView):

    def post(self, request):

        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Message sent"})

        return Response(serializer.errors)