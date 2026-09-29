# 틈 — 잠깐 멈추고, 다시 시작하기

**지금 기분과 남은 시간을 입력하면 AI가 바로 실행할 수 있는 2~3단계 회복 루틴을 만들어 주는 웹 서비스**입니다. 긴 휴식을 내기 어려운 학생과 직장인을 위해 가입 없이 사용할 수 있도록 만들었습니다.

## 평가자용 바로가기

| 확인할 내용 | 링크 |
| --- | --- |
| 실제 작동하는 서비스 | **[틈 운영 사이트](https://codyssey-a1-3-nine.vercel.app/)** |
| 전체 소스와 커밋 기록 | [GitHub 저장소](https://github.com/highslow1536/Codyssey-A1-3) · [커밋 기록](https://github.com/highslow1536/Codyssey-A1-3/commits/main/) |
| 기획 의도·대상·화면·AI 흐름 | [서비스 기획서](docs/PLAN.md) |
| AI를 활용한 구현과 오류 수정 과정 | [AI 작업 기록](docs/AI_WORK_LOG.md) |
| 운영 화면 증빙 | [데스크톱 전체 화면](docs/evidence/desktop.png) · [모바일 전체 화면](docs/evidence/mobile.png) · **[실제 AI 결과 화면](docs/evidence/ai-result.png)** |

## 화면으로 먼저 보기

아래 이미지는 모두 [운영 사이트](https://codyssey-a1-3-nine.vercel.app/)를 브라우저에서 직접 캡처했습니다. 이미지를 누르면 원본 크기로 볼 수 있습니다.

### 1. 첫 화면

[![틈 서비스 첫 화면](docs/evidence/hero.png)](docs/evidence/hero.png)

### 2. 서비스 소개와 사용 순서

[![기분 선택, 시간 선택, 루틴 생성의 세 단계 소개](docs/evidence/features.png)](docs/evidence/features.png)

### 3. 모바일 입력과 실제 AI 결과

| 모바일 입력 화면 | 실제 Copa AI 생성 결과 |
| --- | --- |
| [<img src="docs/evidence/mobile-form.png" alt="모바일 기분과 시간 입력 화면" width="280">](docs/evidence/mobile-form.png) | [<img src="docs/evidence/ai-result.png" alt="운영 사이트에서 생성한 3분 회복 루틴" width="680">](docs/evidence/ai-result.png) |

### 4. 필수 입력 안내와 FAQ

[![기분과 시간을 선택하지 않았을 때 표시되는 안내](docs/evidence/validation.png)](docs/evidence/validation.png)

[![자주 묻는 질문 구획](docs/evidence/faq.png)](docs/evidence/faq.png)

[데스크톱 페이지 전체 보기](docs/evidence/desktop.png) · [모바일 페이지 전체 보기](docs/evidence/mobile.png)

## 보너스 과제 확인

| PDF 보너스 항목 | 구현·재현 |
| --- | --- |
| ① 운영 자동화 또는 데이터 저장 고도화 | 실제 AI 생성 결과를 받은 뒤 **이 기기에 저장**을 누르면 최신 루틴 1개가 브라우저 `localStorage`에 남습니다. 새로고침 후 **다시 보기**, **삭제**까지 동작합니다. [저장 화면](docs/evidence/saved-routine.png) · [코드](js/app.js) |
| ② UX 및 측정 고도화 | **다크 모드** 버튼으로 테마를 바꾸고 새로고침 후에도 선택을 유지합니다. [어두운 화면](docs/evidence/dark-mode.png) · [스타일](css/style.css) · [검증 방법](docs/PLAN.md#보너스-기능) |

결과 저장은 사용자가 직접 선택해야 시작됩니다. 자유 입력 원문과 API 키는 별도로 저장하지 않지만, 생성 결과에 입력 내용이 반영될 수 있으므로 민감한 정보는 입력하지 마세요. 저장된 결과는 다른 기기와 공유되지 않습니다. 두 기능의 데스크톱·모바일 재현 절차는 [브라우저 테스트](tests/browser_smoke.cjs)에 있습니다.

## 미션 조건별 확인 경로

| 조건 | 구현·증빙 |
| --- | --- |
| 3개 이상 구획과 메뉴 이동 | 운영 사이트의 히어로 → 소개 → 루틴 만들기 → FAQ. [화면 코드](index.html) |
| 반응형 화면 | 1280px [데스크톱](docs/evidence/desktop.png), 375px [모바일](docs/evidence/mobile.png) 캡처. [스타일 코드](css/style.css) |
| 실제 AI 입력과 결과 | 기분·시간·상황 입력 후 단계별 루틴 출력. [운영 결과 캡처](docs/evidence/ai-result.png) · [화면 동작 코드](js/app.js) |
| Python Vercel Serverless API | [`api/routine.py`](api/routine.py) · [Vercel 설정](vercel.json) |
| 응답 지연 개선 | [현재 적용 사항과 캐시·모델·요약 전략](#응답-지연-개선-전략) · [기획서](docs/PLAN.md#응답-지연-개선) |
| 운영 E2E 재현·키 관리 | [재현 명령과 실제 검증 로그](#운영-e2e-재현) · [키 유출 대응 절차](#키-유출-시-대응) |
| 보너스 2개 항목 | [저장·다크 모드 구현과 화면 증빙](#보너스-과제-확인) |
| 기획서·README·AI 작업 과정 | [기획서](docs/PLAN.md) · 현재 README · [작업 기록](docs/AI_WORK_LOG.md) |

AI 작업 기록에는 실제 구현·테스트·수정 사항과 연결된 Git 커밋을 정리했습니다. **Codex 대화 화면 원본 캡처는 공개 저장소에 포함하지 않았으므로, 평가 과정에서 대화 화면 자체를 요구한다면 별도로 제출해야 합니다.**

## 서비스 사용 흐름

1. 상단 **루틴 만들기**로 이동합니다.
2. 현재 기분(지침·불안·산만·무기력)과 가능한 시간(3·5·10·15분)을 선택합니다. 상황 설명은 선택이며 최대 160자입니다.
3. **나만의 루틴 받아보기**를 누르면 결과 제목, 안내, 소요 시간이 표시된 2~3개 행동과 마무리 문장이 나타납니다. 다시 만들기도 가능합니다. 원하면 **이 기기에 저장**을 눌러 결과를 나중에 다시 볼 수 있습니다.

필수 입력 누락, 서버 오류, 연결 실패, 시간 초과를 화면에 안내합니다. 서비스는 일상 루틴 아이디어를 제공하며 의료·심리 상담을 대신하지 않습니다. 입력 내용과 생성 결과를 사이트 데이터베이스에 저장하지 않습니다. 결과를 저장하면 현재 브라우저에만 보관하고 직접 삭제할 수 있습니다.

## AI 연결과 코드 구조

| 영역 | 역할 | 파일 |
| --- | --- | --- |
| HTML/CSS | 화면·메뉴·반응형 레이아웃 | [index.html](index.html), [css/style.css](css/style.css) |
| JavaScript | 입력 검사 → `fetch('/api/routine')` → 결과·오류 표시, 선택한 결과 저장·테마 전환 | [js/app.js](js/app.js) |
| Python Vercel Function | 입력 재검사, Copa AI 호출, JSON 결과·시간 합 검증 | [api/routine.py](api/routine.py) |
| 배포 설정 | 정적 화면과 파일 기반 Python 함수를 함께 배포 | [vercel.json](vercel.json), [requirements.txt](requirements.txt) |

백엔드는 Codyssey Copa의 `https://copa.codyssey.kr/v1/chat/completions`에 Chat Completions 형식으로 요청합니다. Vercel 환경 변수 **`OPENAI_API_KEY`에는 Copa virtual key**, **`MODEL`에는 모델명**을 넣습니다(기본값 `gpt-5-mini`). 키는 브라우저 코드와 저장소에 포함하지 않습니다. [환경 변수 예시](.env.example)

`POST /api/routine`의 요청 예시:

```json
{"mood":"지침","minutes":3,"context":"잠시 쉬고 싶어요"}
```

성공 응답의 `routine`에는 `title`, `intro`, `steps`(`title`, `minutes`, `description`), `closing`이 들어갑니다. 서버는 단계 2~3개의 시간 합이 선택한 시간과 일치하는지 검사합니다. 잘못된 입력은 400, AI 서비스 실패는 502/503, 연결 지연은 504로 처리합니다.

## 응답 지연 개선 전략

**현재 적용:** `MODEL`의 기본값을 경량 모델 `gpt-5-mini`로 두고, 자유 입력을 160자로 제한합니다. AI 응답은 제목·소개·2~3개의 실행 단계·마무리로 구성하고 단계 설명을 한 문장으로 제한해 결과를 짧게 요약합니다. 요청 중에는 로딩 상태를 표시하며, 오래 걸리는 요청에는 시간 초과와 재시도 안내를 제공합니다.

**추가 개선 옵션(미구현):** 자유 입력이 없는 요청 중 기분·소요 시간·모델·프롬프트 버전이 같은 결과만 서버 측 공유 캐시에 10분간 저장합니다. 개인 상황이 담길 수 있는 자유 입력은 캐시하지 않습니다. 운영 시 응답 시간의 중앙값과 p95, 캐시 적중률을 측정하고 지연이 크면 공급자가 지원하는 더 작은 모델을 `MODEL`로 선택하거나 소개·마무리 문장을 더 짧게 요청합니다.

## 실제 검증 결과

- 운영 URL의 HTML·CSS·JavaScript·아이콘: **200** 확인
- 운영 API에 `지침`·`3분` 요청: **200**, 3단계의 소요 시간 합 **3분** 확인
- 실제 브라우저 결과 표시: [AI 결과 캡처](docs/evidence/ai-result.png)
- 1280px·375px Chrome 화면에서 가로 넘침, 필수 입력 안내, 결과 표시, 다시 만들기 확인
- Python 단위 테스트 **3건 통과**: [테스트 코드](tests/test_routine.py). 브라우저 확인 코드: [화면 테스트](tests/browser_smoke.cjs), [실제 결과 캡처](tests/capture_live_result.cjs)

AI가 작성한 초안을 그대로 두지 않고, Vercel 진입점 오류·API 제공자 불일치·결과의 시간 중복 표시를 수정했습니다. 관련 변경은 [배포 설정 수정](https://github.com/highslow1536/Codyssey-A1-3/commit/c76109fb23ebef9e24ef5a595cb376f2440a105f), [Copa API 전환](https://github.com/highslow1536/Codyssey-A1-3/commit/ebec752cd6af852087195e49366c18c751f00a24), [시간 표시 수정](https://github.com/highslow1536/Codyssey-A1-3/commit/4681accbbedc2d012c9af863c6862ed0395ce5ed)에서 확인할 수 있습니다.

## 운영 E2E 재현

Python 3.12 이상에서 저장소 루트의 `python3 tests/e2e_live.py`를 실행합니다. 추가 패키지나 로컬 API 키 없이 운영 URL의 4개 화면 구획과 CSS·JavaScript 로딩, 실제 Copa AI 응답의 2~3단계·시간 합, 잘못된 입력에 대한 400 응답을 차례로 검증합니다. 다른 배포를 검사하려면 `python3 tests/e2e_live.py https://example.vercel.app/`처럼 URL을 인자로 전달합니다. 실제 AI 요청 1회가 발생하므로 공급자의 사용량에 포함될 수 있습니다. [재현 스크립트](tests/e2e_live.py)

2026-09-28 운영 URL에서 실행한 로그(응답 본문·입력·키는 출력하지 않음):

```text
PASS GET /: 200, four sections
PASS GET /css/style.css: 200
PASS GET /js/app.js: 200
PASS POST /api/routine: 200, 3 steps, total 3 min, 18.5s
PASS POST invalid /api/routine: 400
```

실행 시간과 AI가 반환하는 단계 수는 요청마다 달라질 수 있습니다. 실제 브라우저에서 입력부터 결과 표시까지의 모습은 [운영 결과 캡처](docs/evidence/ai-result.png)와 [브라우저 확인 코드](tests/capture_live_result.cjs)에서 확인할 수 있습니다.

## 키 유출 시 대응

1. Copa virtual key가 코드·Git 기록·로그·캡처 등에 노출됐다면 **공급자에서 해당 키를 즉시 폐기**하고 새 키를 발급합니다. 단순히 파일에서 지우는 것으로는 이미 노출된 키를 보호할 수 없습니다. [GitHub의 비밀값 유출 대응 안내](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
2. Vercel 프로젝트에서 `OPENAI_API_KEY`를 새 값으로 교체합니다. 적용한 모든 환경(Production/Preview/Development)을 확인하고 새 배포를 실행합니다. 환경 변수 변경은 기존 배포에 소급 적용되지 않습니다. [Vercel 환경 변수 안내](https://vercel.com/docs/environment-variables) · [키 교체 안내](https://vercel.com/docs/environment-variables/rotating-secrets)
3. [운영 E2E 스크립트](tests/e2e_live.py)로 새 배포를 확인하고, 공급자의 사용량·오류 내역과 Vercel 실행 로그에서 이상 호출을 조사합니다. 저장소에 키가 들어갔다면 노출 위치를 제거하고 GitHub의 기록 정리 절차를 검토합니다. 기록 재작성은 협업자와 조율해야 하며, 키 폐기를 대신하지 않습니다. 키 원문은 이슈·로그·문서에 다시 올리지 않습니다.

## 로컬 실행과 재배포

Python 3.12 이상에서 프로젝트 루트에서 `python3 dev_server.py`를 실행하고 `http://localhost:8000`을 엽니다. 실제 AI 생성에는 서버 환경 변수 `OPENAI_API_KEY`가 필요합니다. 검증은 `python3 -m unittest discover -s tests -v`로 실행합니다.

배포는 GitHub `main` 브랜치와 Vercel을 연결해 자동으로 진행합니다. Vercel 프로젝트의 **Settings → Environment Variables**에서 `OPENAI_API_KEY`와 필요 시 `MODEL`을 설정합니다. 환경 변수를 변경했다면 재배포해야 새 값이 적용됩니다. 키 값은 코드, 문서, 캡처에 넣지 마세요.
