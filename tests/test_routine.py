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
    def test_calls_responses_api_and_accepts_matching_minutes(self):
        routine = {
            "title": "작은 쉼",
            "intro": "천천히 시작해요.",
            "steps": [
                {"title": "호흡", "minutes": 2, "description": "숨을 고르세요."},
                {"title": "움직임", "minutes": 3, "description": "어깨를 움직이세요."},
            ],
            "closing": "충분해요.",
        }
        payload = {"output": [{"type": "message", "content": [{"type": "output_text", "text": json.dumps(routine)}]}]}

        def opener(request, timeout):
            self.assertEqual(request.full_url, "https://api.openai.com/v1/responses")
            self.assertEqual(timeout, 16)
            self.assertEqual(request.headers["Authorization"], "Bearer test-key")
            body = json.loads(request.data)
            self.assertEqual(body["input"], "기분: 지침\n사용 가능 시간: 5분\n상황: 회의 직후")
            self.assertEqual(body["store"], False)
            return MockResponse(json.dumps(payload).encode())

        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
            self.assertEqual(create_routine("지침", 5, "회의 직후", opener), routine)

    def test_rejects_wrong_total_minutes(self):
        routine = {"steps": [{"minutes": 1}, {"minutes": 1}]}
        payload = {"output": [{"type": "message", "content": [{"type": "output_text", "text": json.dumps(routine)}]}]}
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}):
            with self.assertRaises(ValueError):
                create_routine("지침", 5, "", lambda request, timeout: MockResponse(json.dumps(payload).encode()))

    def test_missing_key_is_explicit(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(RuntimeError):
                create_routine("지침", 5, "")


if __name__ == "__main__":
    unittest.main()
