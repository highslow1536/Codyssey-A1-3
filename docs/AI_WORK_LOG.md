# AI 코드 작성 과정 기록

작성일: 2026-09-28

## 실제 작업 흐름

1. 사용자가 제공한 미션 PDF에서 정적 프런트엔드, Python Vercel Function, 실제 AI API, 문서와 증빙 조건을 확인했다.
2. AI 도구를 이용해 ‘틈’의 HTML/CSS/JavaScript 화면과 `api/routine.py`를 작성했다. 사용자의 기분·시간·상황을 입력받고, 구조화된 AI 결과를 표시하도록 구성했다.
3. 최초 문서 초안에는 구현과 다른 API 경로·입력 항목이 포함되었다. 메인 작업에서 실제 코드에 맞게 기획서를 수정했다. AI 생성 초안을 구현과 대조해 바로잡은 사례다.
4. Python 단위 테스트 3건과 HTTP 입력 오류 응답을 확인했다. Chrome에서 데스크톱 1280px, 모바일 375px 레이아웃과 입력 안내·모의 응답 렌더링·다시 만들기를 검증했다. 실제 OpenAI 호출과 Vercel 배포는 키와 프로젝트 연결 여부에 따라 별도로 기록한다.
5. 완성된 파일을 `highslow1536/Codyssey-A1-3` GitHub 저장소의 `main` 브랜치에 업로드했다.
6. 첫 Vercel 빌드가 Python 진입점 탐색 오류로 실패했다. 정적 화면과 `api/`의 파일 기반 함수를 함께 배포하도록 `vercel.json`에서 프레임워크를 `Other`로 고정했다. 새 커밋의 Vercel 상태가 성공인 것을 확인했다.
7. 운영 URL `https://codyssey-a1-3-nine.vercel.app/`에서 화면과 정적 자산은 200, `GET /api/routine`은 405로 확인했다. AI 키가 아직 없어 정상 입력의 POST는 503을 반환한다. 실제 생성 결과 검증은 키 설정 후 진행한다.
8. 사용자가 제공한 Copa 공식 호출 예제를 바탕으로 OpenAI Responses 호출을 Copa Chat Completions 호출로 수정했다. `OPENAI_API_KEY`에는 virtual key를, `MODEL`에는 모델명을 사용한다. JSON 응답 구조와 단계 시간 합을 서버에서 검증한다.
9. 재배포 후 운영 API에 `지침`·`3분`을 전송하여 200 응답과 3단계의 시간 합 3분을 확인했다. 실제 브라우저에서도 결과가 표시됐다. 첫 캡처에서 단계 제목과 UI의 시간 중복을 발견해 수정하고, 다시 실제 AI 결과를 받아 `docs/evidence/ai-result.png`에 저장했다.

## 제출용 화면 증빙

- 화면 캡처: `docs/evidence/desktop.png`, `docs/evidence/mobile.png`, `docs/evidence/ai-result.png`는 실제 운영 화면이다.
- AI 대화 증빙: 이 작업의 실제 Codex 대화 화면을 캡처해 같은 폴더에 둔다. 이 문서는 대화 캡처를 대신하지 않는다.
- 실제 AI API 호출이 불가능한 환경에서는 모의 응답을 실제 결과로 표시하지 않는다.

민감한 키와 개인 입력은 캡처에 포함하지 않는다.
