from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, AllowAny

from .models import Contact
from .serializers import ContactSerializer


class ContactView(APIView):

    # 🔥 Dynamic permissions
    def get_permissions(self):
        if self.request.method == "POST":
            return [AllowAny()]      # ✅ Public can send message
        return [IsAdminUser()]       # ✅ Only admin can view

    # ✅ GET → fetch all messages (Admin only)
    def get(self, request):
        contacts = Contact.objects.all().order_by("-id")
        serializer = ContactSerializer(contacts, many=True)

        return Response(
            {
                "count": contacts.count(),
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, pk):
        try:
            contact = Contact.objects.get(pk=pk)
            contact.delete()
            
            return Response(
              {"message": "Deleted successfully"},
             status=status.HTTP_200_OK
            )
        except Contact.DoesNotExist:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    # ✅ POST → save message (Public)
    def post(self, request):
        serializer = ContactSerializer(data=request.data)

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