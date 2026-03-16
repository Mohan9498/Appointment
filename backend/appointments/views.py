from rest_framework.views import APIView
from rest_framework.response import Response

class AppointmentView(APIView):

    def post(self, request):
        print(request.data)
        return Response({"message":"Appointment booked"})   