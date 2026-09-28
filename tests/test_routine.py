import io
import json
import os
import unittest
from unittest.mock import patch

from api.routine import create_routine


class MockResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


class RoutineTests(unittest.TestCase):
    def test_calls_provider_chat_api_and_accepts_matching_minutes(self):
        routine = {
            "title": "작은 쉼",
            "intro": "천천히 시작해요.",
            "steps": [
                {"title": "호흡", "minutes": 2, "description": "숨을 고르세요."},
                {"title": "움직임", "minutes": 3, "description": "어깨를 움직이세요."},
            ],
            "closing": "충분해요.",
        }
        payload = {"choices": [{"message": {"content": json.dumps(routine)}}]}

        def opener(request, timeout):
            self.assertEqual(request.full_url, "https://copa.codyssey.kr/v1/chat/completions")
            self.assertEqual(timeout, 18)
            self.assertEqual(request.headers["Authorization"], "Bearer test-key")
            body = json.loads(request.data)
            self.assertEqual(body["model"], "provider-model")
            self.assertEqual(body["messages"][0]["role"], "system")
            self.assertEqual(body["messages"][1], {"role": "user", "content": '{"mood": "지침", "minutes": 5, "context": "회의 직후"}'})
            return MockResponse(json.dumps(payload).encode())

        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key", "MODEL": "provider-model"}):
            self.assertEqual(create_routine("지침", 5, "회의 직후", opener), routine)

    def test_rejects_wrong_total_minutes(self):
        routine = {
            "title": "쉼", "intro": "시작", "closing": "마무리",
            "steps": [
                {"title": "호흡", "minutes": 1, "description": "숨을 쉬세요."},
                {"title": "정리", "minutes": 1, "description": "주위를 정리하세요."},
            ],
        }
        payload = {"choices": [{"message": {"content": json.dumps(routine)}}]}
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
            with self.assertRaises(ValueError):
                create_routine("지침", 5, "", lambda request, timeout: MockResponse(json.dumps(payload).encode()))

    def test_missing_key_is_explicit(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(RuntimeError):
                create_routine("지침", 5, "")


if __name__ == "__main__":
    unittest.main()
