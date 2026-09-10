# ATMORA v2.0 — полный frontend: сайт + Operator Console

Это текущая Awwwards-oriented версия Atmora с шестью публичными routes и настоящим 404:

```text
/             — cinematic campaign / вход в историю
/technology   — dew point, condensation physics, device
/platform     — climate instrument, Intelligence, Cloud
/lab          — evidence chain, water states, Water Batch
/pilot        — site-first pilot, decision framework, assessment
/privacy      — состояния local demo / remote submit и правила данных
/404          — настоящий not-found state
```


## Operator Console

В v2.0 добавлен полноценный **frontend-only Operator Console**. Он открывается напрямую без login/auth:

```text
/app                    → /app/overview
/app/overview           — command overview
/app/devices            — устройства + status/water filters
/app/devices/A-001      — detail устройства
/app/fleet              — fleet schematic
/app/analytics          — 24H / 7D / 30D / 90D analytics
/app/water              — water evidence ledger
/app/water/A-00284      — batch evidence detail
/app/alerts             — alerts + local acknowledge
/app/maintenance        — service state
/app/reports            — frontend report previews
/app/settings           — local UI preferences
```

Это **только frontend**: нет backend, database, auth, API или fake remote actions. Все operational values помечены как `SYNTHETIC DEMO DATA`. Настройки единиц/плотности/motion сохраняются только в `localStorage`.

Отдельный QA console:

```bash
npm run qa:console
```

Он поддерживает 11 representative scenes и 7 целевых ширин; полная матрица — **77 combinations**.
Финальный offline gate v2.0: **77/77 console + 42/42 public renders без horizontal overflow**. Автоматические проверки: **10 core + 83 source + 13 browser/static = 106 PASS**.

## Быстрый запуск

```bash
npm install
npm run dev
```

Обычно Vite откроется на:

```text
http://localhost:5173
```

## Termux / Android — важно

Не выполняй `npm install` внутри `/storage/emulated/0/Download/...`. Android shared storage может запрещать symlink, которые npm создаёт в `node_modules/.bin`, из-за чего появляется `EACCES`.

Сначала перенеси проект во внутреннюю файловую систему Termux:

```bash
mkdir -p ~/projects/atmora
cp -r ~/storage/downloads/atmora-awwwards-v2.0-source/. ~/projects/atmora/
cd ~/projects/atmora
rm -rf node_modules
npm install
```

Правильный путь выглядит примерно так:

```text
/data/data/com.termux/files/home/projects/atmora
```

Не используй `sudo`, `chmod -R 777`, `npm --force` или `--no-bin-links` как обход этой проблемы.

## Полная release-проверка

После нормальной установки dependencies:

```bash
npm run verify:release
```

Внутри: core/source tests, asset budget, TypeScript, ESLint, production Vite build + prerender и Playwright runtime QA.

Отдельно:

```bash
npm test
npm run qa:assets
npm run qa:static
npm run typecheck
npm run lint
npm run build
npm run qa:runtime
```

`npm run qa:runtime` теперь сам подбирает браузер: сначала `ATMORA_CHROMIUM_PATH`, затем установленный в системе Chromium/Chrome/Brave, затем уже скачанный Playwright Chromium. Если браузера нет вообще, команда один раз выполнит `npx playwright install chromium` и запустит Chromium-only QA. Чтобы запретить автоскачивание, используй `ATMORA_QA_NO_BROWSER_INSTALL=1 npm run qa:runtime`. Для полного Chromium + Firefox + WebKit прогона после установки всех Playwright browsers используй `npm run qa:crossbrowser`.

Если после `npm install` появился `package-lock.json`, не удаляй его. Для следующей воспроизводимой установки используй `npm ci`.


## Что добавлено и исправлено к v1.5

v1.5 — это runtime/motion/jury polish поверх v1.4, без добавления тяжёлого animation stack:

- внутренние `CinematicHeading` теперь гарантированно раскрываются в настоящем runtime, а не могут остаться внутри line-mask;
- JS-router и CSS page transition используют один timing source: **360 ms cover + 420 ms reveal ≈ 780 ms**;
- mobile nav остаётся persistent/fixed после первого экрана;
- touch сбрасывает desktop optical hover offsets, поэтому эффект не «залипает» после tap;
- Technology mobile instrument получил отдельные label/value уровни;
- desktop Technology threshold annotation больше не пересекает headline;
- Lab desktop гарантирует negative space до evidence-record, а mobile сохраняет полный `EVIDENCE BEFORE CONFIDENCE.` без внутреннего clipping;
- Pilot показывает ключевую фразу `A SITE BEFORE A MACHINE.` в первом desktop viewport;
- mobile menu корректно исключает из взаимодействия настоящий footer.

## Что добавлено и исправлено к v1.4

Кроме v1.3 threshold experience, v1.4 закрывает submission-level gaps:

- `/privacy` стал настоящей route и prerender page;
- при настроенном remote endpoint assessment нельзя отправить без явного privacy acknowledgement;
- без endpoint форма остаётся честным LOCAL DEMO и ничего не отправляет;
- исправлен важный font cascade bug, который мог сбрасывать body copy в browser serif;
- Privacy получила light-surface navigation с нормальным контрастом;
- добавлены intrinsic image dimensions и расширен responsive `srcset` pipeline;
- добавлены `og:image:alt`, Twitter image alt, `og:site_name`, favicon/webmanifest и `noindex` для 404;
- mobile shell учитывает iPhone safe-area inset;
- Netlify/Vercel получают immutable asset cache и conservative security/privacy headers;
- static renderer теперь можно запускать route/width batches, не ожидая одну длинную 6×7 сессию.

## Реальный backend assessment

```bash
cp .env.example .env.local
```

Укажи:

```text
VITE_ATMORA_ASSESSMENT_ENDPOINT=https://your-domain.example/api/assessment
```

При наличии endpoint финальный шаг потребует privacy acknowledgement и отправит JSON с timeout/error state. Backend всё равно обязан сам делать validation, rate-limit/anti-spam и реализовывать реальную privacy policy.

## Production domain / SEO

```bash
ATMORA_SITE_URL=https://your-domain.example npm run build
```

Эта переменная используется для canonical и sitemap origin.

## STATIC RENDER PROOF

Полный запуск:

```bash
npm run qa:static
```

Целевые ширины:

```text
1440  1280  1024  768  430  390  360
```

Чтобы быстро проверять конкретную страницу/ширину:

```bash
python scripts/render_multipage_qa.py --route privacy --width 390
python scripts/render_multipage_qa.py --route lab --width 430 --width 390 --width 360
```

Файлы сохраняются в:

```text
artifacts/qa/multipage-static-render-proof/
```

Это честный **STATIC RENDER PROOF** layout/CSS/media. Он не доказывает реальный Vite runtime, точный Fontsource render, animation timing или Core Web Vitals. Для этого нужен `npm run verify:release`, затем Lighthouse/WebPageTest и browser/device pass на production deployment.

Точный статус смотри в `docs/QA.md`.

## Hotfix v1.5.2

Если `npm install` уже прошёл, но `npm run typecheck` ругается на optional `srcSet`, а ESLint на `setState` внутри `Nav` effect, используйте v1.5.2. В нём также можно запускать Chromium Playwright без скачивания браузера: `ATMORA_CHROMIUM_PATH="$(command -v chromium)" ATMORA_CHROMIUM_ONLY=1 npx playwright test`.
