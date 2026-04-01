from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ContactSerializer


class ContactView(APIView):

    def get(self, request):
        return Response(
            {"message": "Contact API working"},
            status=status.HTTP_200_OK
        )

    def post(self, request):
        data = request.data

        # Validate required fields
        required_fields = ["name", "email", "message"]
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return Response(
                {
                    "error": "Missing required fields",
                    "fields": missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate & save using serializer
        serializer = ContactSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Message sent successfully",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "error": "Invalid data",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )