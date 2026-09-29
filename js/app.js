const form = document.querySelector('#routine-form');
const contextInput = document.querySelector('#context');
const charCount = document.querySelector('#char-count');
const errorBox = document.querySelector('#form-error');
const submitButton = document.querySelector('#submit-button');
const result = document.querySelector('#result');
const resetButton = document.querySelector('#reset-button');
const saveButton = document.querySelector('#save-button');
const saveStatus = document.querySelector('#save-status');
const savedSection = document.querySelector('#saved-routine');
const themeToggle = document.querySelector('#theme-toggle');
const ROUTINE_STORAGE_KEY = 'teum-saved-routine';
const THEME_STORAGE_KEY = 'teum-theme';
let currentRoutine = null;
let savedRoutine = null;

function isRoutine(data) {
  return data && typeof data.title === 'string' && typeof data.intro === 'string'
    && typeof data.closing === 'string' && Array.isArray(data.steps)
    && data.steps.length >= 2 && data.steps.length <= 3
    && data.steps.every((step) => step && typeof step.title === 'string'
      && typeof step.description === 'string' && Number.isInteger(step.minutes)
      && step.minutes > 0);
}

function refreshSaved() {
  savedSection.hidden = !savedRoutine;
  if (savedRoutine) document.querySelector('#saved-title').textContent = savedRoutine.title;
}

function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.textContent = dark ? '☀ 라이트 모드' : '☾ 다크 모드';
  themeToggle.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#17251f' : '#f7f5ef';
}

try {
  const stored = JSON.parse(localStorage.getItem(ROUTINE_STORAGE_KEY));
  if (isRoutine(stored)) savedRoutine = stored;
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light');
} catch {
  applyTheme('light');
}
refreshSaved();

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Theme still works for this visit. */ }
});

contextInput.addEventListener('input', () => {
  charCount.textContent = `${contextInput.value.length} / 160`;
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  errorBox.focus();
}

function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

function renderRoutine(data) {
  currentRoutine = data;
  saveStatus.textContent = '';
  document.querySelector('#result-title').textContent = data.title;
  document.querySelector('#result-intro').textContent = data.intro;
  document.querySelector('#result-closing').textContent = data.closing;
  const list = document.querySelector('#result-steps');
  list.replaceChildren();
  data.steps.forEach((step, index) => {
    const item = document.createElement('li');
    const number = document.createElement('span');
    number.className = 'step-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = /\d+\s*분/.test(step.title)
      ? step.title
      : `${step.title} · ${step.minutes}분`;
    const description = document.createElement('p');
    description.textContent = step.description;
    content.append(title, description);
    item.append(number, content);
    list.append(item);
  });
  form.hidden = true;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.querySelector('#result-title').setAttribute('tabindex', '-1');
  document.querySelector('#result-title').focus({ preventScroll: true });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();
  const mood = form.querySelector('input[name="mood"]:checked')?.value;
  const minutes = Number(form.querySelector('input[name="minutes"]:checked')?.value);
  const context = contextInput.value.trim();

  if (!mood || !minutes) {
    showError('기분과 시간을 모두 선택해 주세요.');
    return;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  submitButton.disabled = true;
  submitButton.firstChild.textContent = '나에게 맞는 루틴을 만드는 중… ';

  try {
    const response = await fetch('/api/routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, minutes, context }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || '루틴을 만들지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
    if (!payload.routine || !Array.isArray(payload.routine.steps)) {
      throw new Error('결과 형식이 예상과 달라요. 다시 시도해 주세요.');
    }
    renderRoutine(payload.routine);
  } catch (error) {
    if (error.name === 'AbortError') {
      showError('응답이 오래 걸리고 있어요. 네트워크를 확인하고 다시 시도해 주세요.');
    } else if (error instanceof TypeError) {
      showError('서버에 연결할 수 없어요. 네트워크를 확인하고 다시 시도해 주세요.');
    } else {
      showError(error.message);
    }
  } finally {
    clearTimeout(timer);
    submitButton.disabled = false;
    submitButton.firstChild.textContent = '나만의 루틴 받아보기 ';
  }
});

resetButton.addEventListener('click', () => {
  result.hidden = true;
  form.hidden = false;
  clearError();
  form.querySelector('input[name="mood"]:checked')?.focus();
});

saveButton.addEventListener('click', () => {
  if (!currentRoutine || !isRoutine(currentRoutine)) return;
  try {
    localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(currentRoutine));
    savedRoutine = currentRoutine;
    refreshSaved();
    saveStatus.textContent = '이 브라우저에 저장했어요.';
  } catch {
    saveStatus.textContent = '저장할 수 없어요. 브라우저 저장 공간 설정을 확인해 주세요.';
  }
});

document.querySelector('#load-saved').addEventListener('click', () => {
  if (savedRoutine) renderRoutine(savedRoutine);
});

document.querySelector('#delete-saved').addEventListener('click', () => {
  try {
    localStorage.removeItem(ROUTINE_STORAGE_KEY);
    savedRoutine = null;
    refreshSaved();
    saveStatus.textContent = '저장한 루틴을 삭제했어요.';
  } catch {
    saveStatus.textContent = '삭제할 수 없어요. 브라우저 저장 공간 설정을 확인해 주세요.';
  }
});
