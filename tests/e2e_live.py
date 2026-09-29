"""Check the deployed page, assets, and real AI API without printing user data."""

import argparse
import json
import time
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import Request, urlopen


DEFAULT_URL = "https://codyssey-a1-3-nine.vercel.app/"


def request(base_url, path, payload=None):
    headers = {}
    body = None
    if payload is not None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = Request(urljoin(base_url, path), data=body, headers=headers)
    try:
        with urlopen(req, timeout=35) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, error.read()


def check(base_url):
    status, html = request(base_url, "")
    assert status == 200, f"GET /: expected 200, got {status}"
    for marker in (b'id="top"', b'id="about"', b'id="routine"', b'id="faq"'):
        assert marker in html, "GET /: a required section is missing"
    for marker in (b'id="theme-toggle"', b'id="save-button"', b'id="saved-routine"'):
        assert marker in html, "GET /: a bonus control is missing"
    print("PASS GET /: 200, four sections")

    for path in ("css/style.css", "js/app.js"):
        status, content = request(base_url, path)
        assert status == 200 and content, f"GET /{path}: expected nonempty 200"
        print(f"PASS GET /{path}: 200")

    start = time.perf_counter()
    status, body = request(base_url, "api/routine", {"mood": "지침", "minutes": 3, "context": ""})
    elapsed = time.perf_counter() - start
    assert status == 200, f"POST /api/routine: expected 200, got {status}"
    routine = json.loads(body)["routine"]
    assert all(isinstance(routine.get(name), str) and routine[name].strip() for name in ("title", "intro", "closing"))
    steps = routine["steps"]
    assert isinstance(steps, list) and 2 <= len(steps) <= 3
    assert all(
        isinstance(step, dict)
        and isinstance(step.get("title"), str) and step["title"].strip()
        and isinstance(step.get("description"), str) and step["description"].strip()
        and type(step.get("minutes")) is int and step["minutes"] > 0
        for step in steps
    )
    assert sum(step["minutes"] for step in steps) == 3
    print(f"PASS POST /api/routine: 200, {len(steps)} steps, total 3 min, {elapsed:.1f}s")

    status, body = request(base_url, "api/routine", {"mood": "잘못된 값", "minutes": 3, "context": ""})
    assert status == 400, f"POST invalid /api/routine: expected 400, got {status}"
    assert isinstance(json.loads(body).get("error"), str)
    print("PASS POST invalid /api/routine: 400")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url", nargs="?", default=DEFAULT_URL, help="Deployed site URL")
    args = parser.parse_args()
    try:
        check(args.base_url.rstrip("/") + "/")
    except (AssertionError, KeyError, TypeError, ValueError, OSError) as error:
        parser.exit(1, f"FAIL E2E: {error}\n")
