from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer


class ApproveAppointment(APIView):

    def post(self,request,id):

        appointment = Appointment.objects.get(id=id)
        appointment.status = "Approved"
        appointment.save()

        return Response({"message":"Appointment approved"})

class AppointmentView(APIView):

    def get(self, request):
        date = request.GET.get("date")
        if date:
            appointments = Appointment.objects.filter(date=date)
            booked_slots = [a.time for a in appointments]
            
            return Response({
                "booked_slots": booked_slots
            })
            appointments = Appointment.objects.all()
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data)

    def post(self,request):

        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors)