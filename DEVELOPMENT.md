# Frontend — Ghi chú kỹ thuật & vận hành (`eh_am_frontend`)

Tài liệu dành cho người code: cách chạy, biến môi trường, lệnh, cấu trúc, bảo mật, quy ước và nguồn gốc. Tổng quan sản phẩm và cách tiếp cận thiết kế giao diện nằm ở [`README.md`](README.md).

Web ứng dụng cho hệ thống quản lý tài sản & công cụ dụng cụ (CCDC) của chuỗi Every Half — dùng cho văn phòng (kế toán, quản lý tài sản) và cho cửa hàng / kho / xưởng rang.

**Ngăn xếp:** React 19 · Vite 8 · TypeScript 6 · TanStack Router / Query / Table · Tailwind CSS 4 · shadcn/ui · Zustand · Zod 4 · i18next · Vitest (browser mode, Playwright)

Backend: [`eh_am_backend`](../eh_am_backend) — API `/v1`, cổng 3006.

---

## Chạy lần đầu

```bash
npm ci
npm run test:browser:install     # tải Chromium cho Vitest (một lần)
npm run dev                      # http://localhost:5175
```

`.env.development.local` đã có sẵn giá trị cho máy dev (API `http://localhost:3006/v1`). Cần backend chạy ở cổng 3006 thì mới đăng nhập được.

⚠️ Cổng **5175** với `strictPort` — không nhảy sang cổng khác khi trùng, vì backend chỉ cho CORS đúng `http://localhost:5175`. Trùng cổng thì Vite dừng và báo lỗi thay vì nhảy cổng âm thầm.

---

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_API_BASE_URL` | Gốc API, **có** `/v1`, **không** có `/` ở cuối. Production phải là `https://` |
| `VITE_DEFAULT_LOCALE` | `vi` \| `en` — ngôn ngữ **trước khi đăng nhập**. Sau đăng nhập, `preferredLocale` từ backend thắng |
| `VITE_APP_ENV` | `development` \| `staging` \| `production` — dev/staging hiện dải nhãn đầu trang, production không hiện |
| `VITE_ENABLE_DEVTOOLS` | `true` chỉ có tác dụng ở dev; bản build production luôn tắt |

⚠️ **Mọi biến `VITE_` đều công khai** — Vite nhúng chúng vào bundle, ai mở DevTools cũng đọc được. Không bao giờ đặt khoá Supabase, `ENCRYPTION_SECRET_KEY` hay khoá FAST vào đây. Mẫu đầy đủ, có chú thích: [`.env.example`](.env.example), [`.env.production.example`](.env.production.example). Các file `.env*` khác bị `.gitignore` chặn.

Giá trị sai (gõ nhầm `producton`, thiếu `VITE_API_BASE_URL`) làm ứng dụng **ném lỗi ngay khi khởi động** thay vì chạy với giá trị mặc định — xem `src/config/env.ts`.

---

## Lệnh hay dùng

```bash
npm run dev              # dev server, HMR
npm run build            # tsc -b + vite build → dist/
npm run preview          # phục vụ dist/ ở 5175 — dùng để kiểm CSP
npm run typecheck        # kiểm kiểu
npm run lint             # eslint
npm run format           # prettier (kèm sắp xếp import + class Tailwind)
npm test                 # Vitest trong Chromium headless
npm run test:coverage    # kèm độ phủ
npm run knip             # tìm file / export / dependency không dùng
```

Trước mỗi commit: `npm run precommit && npm test`

---

## Cấu trúc

```text
eh_am_frontend/
├── src/
│   ├── main.tsx              khởi động: cấu hình Zod → i18n → QueryClient → Router
│   ├── config/env.ts         ⭐ đọc + kiểm biến môi trường (sai là ném lỗi)
│   ├── lib/
│   │   ├── api/              axios client (refresh token), ApiError, handleApiError, *.api + *.queries
│   │   ├── i18n/             i18next + locales vi/en (en bắt buộc đủ khoá như vi — thiếu là lỗi biên dịch)
│   │   ├── zod-config.ts     ⭐ Zod không-JIT (CSP) + thông báo validation theo ngôn ngữ
│   │   ├── safe-redirect.ts  chỉ cho quay về đường dẫn nội bộ sau đăng nhập
│   │   └── password-policy.ts  bản đối chiếu luật mật khẩu của backend
│   ├── stores/auth-store.ts  phiên đăng nhập (sessionStorage) + helper vai trò
│   ├── routes/               TanStack Router file-based: (auth), (errors), _authenticated
│   ├── features/             auth · errors · settings · assets (màn hình nghiệp vụ)
│   ├── components/
│   │   ├── ui/               shadcn/ui — không sửa tay, thêm bằng `npx shadcn add`
│   │   ├── data-table/       bảng dữ liệu dùng chung (TanStack Table)
│   │   └── layout/           sidebar, header, khung trang
│   ├── context/ hooks/ styles/ assets/
│   └── test-utils/setup.ts   chạy trước mọi test (cấu hình Zod + i18n)
└── vite.config.ts            ⭐ CSP, cổng, alias, cấu hình Vitest
```

---

## Bảo mật

### Phiên đăng nhập

- Access token và refresh token do backend trả về **đã mã hoá** (AES-256-GCM); frontend chỉ giữ và gửi lại, không giải mã được.
- Lưu ở `sessionStorage` (khoá `eh.am.session`): đóng tab là mất phiên. Thiết bị dùng chung ở cửa hàng không giữ phiên của người ca trước.
- Làm mới **chủ động** 60 giây trước khi hết hạn, và **bị động** khi gặp 401; nhiều request cùng lúc chỉ tạo **một** lời gọi refresh.

### Content-Security-Policy

JavaScript đọc được `sessionStorage`, nên XSS là con đường chính để lấy phiên — CSP là lớp chặn. `vite.config.ts` tiêm thẻ `<meta http-equiv="Content-Security-Policy">` vào `index.html` **khi build** (dev server không áp, vì HMR cần script nội tuyến):

- `script-src 'self'` — không `'unsafe-inline'`, không `'unsafe-eval'`.
- `connect-src` chỉ gồm chính origin, origin của `VITE_API_BASE_URL` và `https://*.supabase.co` → **đổi tên miền API thì phải build lại**.
- Zod chạy chế độ không-JIT (`src/lib/zod-config.ts`) để không bắn vi phạm CSP mỗi lần tải trang.

Kiểm CSP bằng bản build thật:

```bash
npm run build && npm run preview
# mở http://localhost:5175, DevTools → Console: không được có dòng "Content Security Policy"
```

### Header phải đặt ở web server (không đặt được bằng thẻ meta)

Trình duyệt **bỏ qua** `frame-ancestors` trong thẻ `<meta>`. Chống clickjacking phải đặt ở nginx (hoặc CDN):

```nginx
add_header Content-Security-Policy "frame-ancestors 'none'" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# SPA: mọi đường dẫn không phải file tĩnh → index.html
location / { try_files $uri /index.html; }
```

### Khác

- `?redirect=` sau đăng nhập chỉ nhận đường dẫn nội bộ (bắt đầu bằng đúng một `/`); `https://…`, `//…`, `/\…`, `javascript:` và chuỗi có ký tự điều khiển bị bỏ — chống open redirect.
- Trang đặt lại mật khẩu đọc token khôi phục từ URL **một lần**, rồi xoá khỏi thanh địa chỉ — token không nằm lại trong lịch sử trình duyệt, không bị chụp màn hình hay chép link kèm theo.
- Devtools (React Query / Router) khoá cứng ở bản build production, kể cả khi biến môi trường đặt sai.
- Ứng dụng có `noindex` — hệ thống nội bộ, không cho công cụ tìm kiếm lập chỉ mục.

---

## Quy ước khi viết màn hình nghiệp vụ

| # | Quy ước | Ở đâu |
| --- | --- | --- |
| 1 | **Phân nhánh theo `error.code`, không theo `error.message`** — `message` đổi theo ngôn ngữ | `src/lib/api/error-code.ts` (bản đối chiếu của backend) |
| 2 | Lỗi API đi qua `handleApiError()` — toast đã dịch + mã tra cứu (`requestId`) để báo lỗi | `src/lib/api/handle-api-error.ts` |
| 3 | Thêm chữ trên giao diện = thêm khoá vào **cả** `vi.ts` và `en.ts` (thiếu `en` là lỗi biên dịch) | `src/lib/i18n/locales/` |
| 4 | Schema Zod không cần tự viết câu lỗi chung ("bắt buộc", "tối đa N ký tự") — đã có sẵn, song ngữ. Chỉ truyền `{ message }` khi cần câu riêng | `src/lib/zod-config.ts` |
| 5 | Ẩn/hiện theo vai trò ở frontend chỉ là **tiện dụng** — quyền thật do backend kiểm | `src/stores/auth-store.ts` (`hasAnyRole`) |

Các chuẩn UI bắt buộc cho mọi màn hình mới (khung trang `Header`+`Main`, trường bắt buộc, trạng thái rỗng/lỗi, a11y, enum→i18n, date picker chung…) được ghi đầy đủ trong [`CLAUDE.md`](CLAUDE.md).

---

## Xử lý sự cố

| Triệu chứng | Nguyên nhân / cách xử lý |
| --- | --- |
| Mọi request báo lỗi CORS, log backend không có gì | Frontend không chạy đúng `http://localhost:5175`, hoặc `CORS_ORIGINS` của backend thiếu origin này |
| Toàn bộ test đỏ ngay khi import `setup.ts` | Thiếu biến môi trường cho test — khai trong `vite.config.ts` › `test.env`, không dùng `.env.test` |
| Một file test báo `Vitest failed to find the runner` ngay sau khi thêm dependency | Vite tối ưu lại dependency giữa lúc chạy. Chạy lại `npm test` |
| Trang trắng sau khi deploy, Console có "Content Security Policy" | Tên miền API khác lúc build → build lại với đúng `VITE_API_BASE_URL` |

---

## Nguồn gốc

Khung ứng dụng từ template **shadcn-admin** (TanStack Router + Vite), qua bản đã chỉnh của `Avantily/avantily_frontend_admin`: client API, luồng auth, xử lý lỗi, i18n. Các điểm **đã sửa / bổ sung so với Avantily** (có ghi chú tại chỗ trong code):

- **CSP có từ ngày đầu** (Avantily ghi là nợ "chặn ra production").
- **Có trang đặt lại mật khẩu** (`/reset-password`) — backend Avantily gửi email dẫn về trang này nhưng web admin Avantily chưa có.
- **Chống open redirect** ở `?redirect=` sau đăng nhập — Avantily đưa thẳng chuỗi vào `navigate()`.
- **Dải nhãn môi trường** (`EnvironmentBanner`) — Avantily có biến `VITE_APP_ENV` nhưng chưa từng viết component.
- **Thông báo validation song ngữ** — Zod khai `sideEffects: false` nên bản build production mất bộ câu mặc định, chỉ còn "Invalid input".
- **`noValidate`** trên form có ô email — bong bóng lỗi của trình duyệt theo ngôn ngữ hệ điều hành, không theo ứng dụng.
- `/me` ánh xạ vai trò theo phạm vi (toàn hệ thống / theo location) thay cho một vai trò phẳng.
