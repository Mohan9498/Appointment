from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class LoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @override_settings(ADMIN_USERNAME="envadmin", ADMIN_PASSWORD="EnvPass123!")
    def test_login_creates_admin_from_environment_credentials(self):
        User.objects.filter(username="envadmin").delete()

        response = self.client.post(
            "/api/login/",
            {"username": "envadmin", "password": "EnvPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            User.objects.filter(username="envadmin", is_staff=True, is_superuser=True).exists()
        )
        self.assertTrue(response.data["is_admin"])
