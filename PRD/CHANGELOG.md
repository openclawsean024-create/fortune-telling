# fortune-telling · CHANGELOG

所有對 `fortune-telling` 規格 / 部署 / 測試的版本變更紀錄。

---

## v3.0.2 — 2026-09-06（repo-fleet 升級）

> 由 repo-fleet 批次 A 自動駕駛：Sean Li / Mavis worker agent

### Added
- `PRD/SPEC.md` v3.0.2 等級規格書（15 條 FR、NFR table、deploy contract、mermaid flow）
- `PRD/CHANGELOG.md` 本檔
- `.github/workflows/ci.yml` GHA 4-job workflow（lint / test / build / deploy to Vercel）
- `tests/fortune.test.ts` Vitest 20 個單元測試（drawTarotCard / calculateLifePath / calculateZodiac / isValidDate / lunarToSolar / solarToLunar / isValidLunarDate / formatDate）

### Changed
- `src/app/api/fortune/route.ts` — `Map<string, any>` → `Map<string, FortuneReport>` + 移除 unused `request` 參數
- `src/app/api/report/route.ts` — `Map<string, any>` → `Map<string, FortuneReport>` + 移除 unused `error` 變數
- `src/app/api/tarot/route.ts` — `catch (error)` → `catch {}` + 移除 unused `nanoid` import
- `src/app/auth/signin/page.tsx` — `<a href="/">` → `<Link href="/">`
- `src/app/report/page.tsx` — `<a href="/">` → `<Link href="/">`；setState in effect → `queueMicrotask` 包裹
- `src/app/my-reports/page.tsx` — setState in effect → `queueMicrotask` 包裹；unused `saveReportId` 標註保留
- `src/app/page.tsx` — 移除 unused `tarotCard` state
- `src/components/PDFExportClient.tsx` — `report: any` → `report: FortuneReport` (8 處)
- `src/lib/fortune.ts` — 修正 `isValidDate` 沒驗證分鐘的 bug（`12:60` 之前會誤判為 true）
- `src/lib/lunar.ts` — 標記 unused `isLeap` 為保留參數（API 介面相容性）

### Removed
- 移除 `src/app/page.tsx` 中 `tarotCard` state（從未被讀取）
- 移除 `src/app/api/tarot/route.ts` 中 unused `nanoid` import

### Fixed
- ESLint 25 problems (14 errors / 11 warnings) → 0 problems
- TypeScript strict build 通過
- 修正 `isValidDate("1990-01-01", "12:60")` 誤判 bug
- 修正 `PDFExportClient.tsx` 引用錯誤欄位（`tarot.card` / `tarot.position` / `tarot.description` → `tarot.name` / `tarot.reversed` / `tarot.nameEn` / `tarot.meaning`）

### Verified
- ✅ `npm run lint` — 0 error / 0 warning
- ✅ `npm test` — 20/20 tests pass
- ✅ `npm run build` — 10 個 static + 4 個 dynamic 端點成功

---

## v3.0.1 — 2026-08（feat(ui): apply 家服 dashboard design）

- 套用「家服 dashboard」設計 token
- ESLint 規則升級（`@typescript-eslint/no-explicit-any` 變 strict、`react-hooks/set-state-in-effect` 新增）

---

## v2.2.1 — 2026-07-19（sweet-spot-driven rewrite）

> 既有 `PRD/SPEC.md` v2.2.1

- 從「全方位算命大平台」重新聚焦到「**塔羅牌 × 每日一抽**」單一工具
- Sweet Spot 體檢分數 3/7 → 切極窄甜蜜點
- 687 行完整規格書：§1 概述、§2 流程、§3 FR、§11 驗證、§15 商業化評分

---

## v1.0 — 2026（初始 Next.js 16 + 五合一命理報告）

> commit `a4830d3 feat(ui): apply 家服 dashboard design`

- 初始 Next.js 16.2.4 + Tailwind 4 + next-auth v5 + @react-pdf/renderer + recharts
- 5 模組命理：紫微斗數 + 八字 + 塔羅 + 生命靈數 + 生肖星座
- 國曆 / 農曆切換
- 22 大阿爾克那塔羅抽牌
- localStorage 持久化 + PDF 匯出
