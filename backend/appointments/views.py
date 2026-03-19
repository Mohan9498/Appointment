from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer


# ✅ APPROVE APPOINTMENT
class ApproveAppointment(APIView):

    def post(self, request, id):
        try:
            appointment = Appointment.objects.get(id=id)
            appointment.status = "Approved"
            appointment.save()

            return Response(
                {"message": "Appointment approved"},
                status=status.HTTP_200_OK
            )

        except Appointment.DoesNotExist:
            return Response(
                {"error": "Appointment not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# ✅ APPOINTMENT VIEW (GET + POST)
class AppointmentView(APIView):

    def get(self, request):
        date = request.GET.get("date")

        # 👉 Return booked slots for selected date
        if date:
            appointments = Appointment.objects.filter(date=date)
            booked_slots = [a.time for a in appointments]

            return Response({
                "booked_slots": booked_slots
            })

        # 👉 Return all appointments (admin use)
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )