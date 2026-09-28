"""Small local server for the static site and Vercel-compatible API handler."""

from http.server import HTTPServer, SimpleHTTPRequestHandler

from api.routine import handler as RoutineHandler


class LocalHandler(RoutineHandler, SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/"):
            return RoutineHandler.do_GET(self)
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path != "/api/routine":
            return self.send_json(404, {"error": "주소를 찾지 못했어요."})
        return RoutineHandler.do_POST(self)


if __name__ == "__main__":
    print("Open http://localhost:8000")
    HTTPServer(("127.0.0.1", 8000), LocalHandler).serve_forever()
