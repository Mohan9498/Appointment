from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Program
from .serializers import ProgramSerializer

class ProgramView(APIView):

    def get(self,request):

        programs = Program.objects.all()
        serializer = ProgramSerializer(programs,many=True)

        return Response(serializer.data)