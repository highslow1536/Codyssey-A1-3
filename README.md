# 틈 — 잠깐 멈추고, 다시 시작하기

지금의 기분과 비워둘 수 있는 시간에 맞춰 2~3단계의 짧은 회복 루틴을 만드는 AI 웹 서비스입니다. 바쁜 학생과 직장인이 가입 없이 바로 사용할 수 있도록 만들었습니다.

## 주요 기능

- 기분 4종, 사용 가능 시간 4종, 선택형 상황 입력(최대 160자)
- OpenAI Responses API를 이용한 개인화된 한국어 루틴 생성
- 각 단계의 소요 시간 합 검증, 로딩·입력 오류·연결 실패·시간 초과 안내
- 모바일·태블릿·데스크톱 반응형 화면과 키보드 탐색

## 기술 구성

| 영역 | 기술 | 역할 |
| --- | --- | --- |
| 프런트엔드 | HTML, CSS, JavaScript | 입력 검증, `fetch('/api/routine')`, 결과 표시 |
| 백엔드 | Python 표준 라이브러리, Vercel Function | 입력 재검증, AI API 호출, 오류 응답 |
| AI | OpenAI Responses API | 구조화된 루틴 생성 |

## 로컬 실행

Python 3.12 이상에서 프로젝트 루트에서 실행합니다.

```bash
python3 dev_server.py
```

브라우저에서 `http://localhost:8000`을 엽니다. AI 기능을 실제로 사용하려면 실행 전에 **서버 환경 변수** `OPENAI_API_KEY`를 설정해야 합니다. 예를 들어 현재 셸에서 `export OPENAI_API_KEY=...`로 설정할 수 있습니다. 키가 없으면 화면은 열리지만 생성 요청은 설정 안내와 함께 실패합니다. `.env.example`은 변수 이름만 보여주는 예시입니다.

`OPENAI_MODEL`은 선택 변수이며 기본값은 `gpt-4.1-mini`입니다. `requirements.txt`에는 추가 의존성이 없습니다.

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. Vercel에서 저장소를 가져와 프로젝트를 만듭니다. `vercel.json`이 프레임워크 프리셋을 `Other`로 고정하여 정적 파일과 `api/routine.py` 파일 기반 함수를 함께 배포합니다. 루트 디렉터리는 저장소 루트로 둡니다. 별도 빌드 명령은 필요하지 않습니다.
3. Vercel 프로젝트의 환경 변수에 `OPENAI_API_KEY`를 등록합니다. 필요하면 `OPENAI_MODEL`도 등록합니다. 키는 코드, README, 화면 캡처에 넣지 않습니다.
4. 배포 후 운영 URL에서 메뉴 이동과 실제 루틴 생성을 확인합니다. 환경 변수 변경 후에는 재배포합니다.

**배포 URL:** [https://codyssey-a1-3-nine.vercel.app/](https://codyssey-a1-3-nine.vercel.app/)

## 요청과 응답

`POST /api/routine`, `Content-Type: application/json`

```json
{"mood":"지침","minutes":5,"context":"회의가 막 끝났어요"}
```

성공 시 `routine` 객체에 `title`, `intro`, `steps`(`title`, `minutes`, `description`), `closing`이 포함됩니다. `steps`는 2~3개이고 분 합계는 선택한 시간과 같아야 합니다. 잘못된 입력은 400, AI 실패는 502/503, 연결 시간 초과는 504로 안내합니다.

## 검증 및 제출 자료

- [GitHub 저장소](https://github.com/highslow1536/Codyssey-A1-3)
- `python3 -m unittest discover -s tests -v`: API 입력·응답·AI 결과 구조 확인
- [서비스 기획서](docs/PLAN.md): 문제, 대상, 화면, AI 흐름, 오류 처리, 테스트 시나리오
- [AI 코드 작성 과정](docs/AI_WORK_LOG.md): 실제 작업 흐름과 제출 증빙 위치
- [데스크톱 화면](docs/evidence/desktop.png)과 [모바일 화면](docs/evidence/mobile.png)은 Chrome에서 운영 URL을 열어 캡처했습니다. 실제 AI 결과 화면과 AI 대화 캡처는 API 키가 설정된 배포 환경 및 이 Codex 대화에서 추가해야 합니다.

운영 URL에서 화면, 정적 파일, Python API 경로를 확인했습니다. 현재 `OPENAI_API_KEY`가 Vercel에 설정되지 않아 실제 AI 생성 요청은 설정 안내(503)를 반환합니다. 키 설정 후 재배포하여 실제 생성 결과를 다시 확인해야 합니다.
