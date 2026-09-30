# Kế hoạch triển khai frontend — UC-IAM-01: Đăng nhập vào EH-AM

> **Yêu cầu 2 (frontend).** Mô tả tính năng phía frontend cho [UC-IAM-01](../../../../eh_am_backend/business/product-docs/product-usecase/M01-nguoi-dung-phan-quyen/UC-IAM-01_dang-nhap-vao-eh-am.md). FE chỉ cần mô tả tính năng (không cần sơ đồ kỹ thuật sâu như backend).
>
> **Trạng thái:** màn đăng nhập và toàn bộ luồng phiên **đã có sẵn** (`src/features/auth/`, `src/lib/api/`, `src/stores/auth-store.ts`, guard `_authenticated`). Kế hoạch này mô tả tính năng và chỉ ra việc còn lại.

## 1. Mô tả tính năng

Nhân viên mở EH-AM, thấy màn **Đăng nhập** (ô Email, ô Mật khẩu, liên kết Quên mật khẩu?). Nhập đúng thì vào trang làm việc đầu tiên theo vai trò; menu chỉ hiện chức năng được phép. Phiên tự làm mới trước khi hết hạn; hết phiên hoặc bị thu hồi thì quay lại màn đăng nhập.

## 2. Màn hình và thành phần liên quan (đã có)

- **Route:** nhóm `(auth)` — `src/routes/(auth)/sign-in.*`; form ở `src/features/auth/`.
- **Guard:** `src/routes/_authenticated/route.tsx` là nơi **duy nhất** chuyển hướng khi chưa đăng nhập (`beforeLoad` -> `/sign-in?redirect=…`); `loader` gọi `ensureQueryData(meQueryOptions())`; người không có vai trò -> `/403`.
- **API:** `src/lib/api/auth.api.ts` (login, refresh, me), `auth.queries.ts` (`meQueryOptions`, `AUTH_ME_QUERY_KEY`); `client.ts` tự làm mới token (chủ động trước 60s + phản ứng khi 401, gộp một promise).
- **Session store:** `src/stores/auth-store.ts` (Zustand) — token ở `sessionStorage` (`eh.am.session`); vai trò từ `/auth/me`; `hasAnyRole`/`canAccessApp` chỉ điều khiển UI, backend mới thực thi quyền thật.
- **Xử lý lỗi:** `handle-api-error.ts` phân nhánh theo `error.code` (không theo message), toast kèm `requestId`.

## 3. Ánh xạ lỗi backend -> giao diện (theo AC/EX của UC)

| Mã lỗi backend | Giao diện |
| --- | --- |
| `CREDENTIALS_INVALID` (401, EX.1) | Thông báo chung "email hoặc mật khẩu không đúng", không nói ô nào |
| `VALIDATION_FAILED` (400, EX.2) | Đánh dấu từng ô lỗi (email/mật khẩu) |
| `ACCOUNT_INACTIVE` (403, EX.3) | Thông báo tài khoản bị khoá/ngừng, đề nghị liên hệ Quản trị hệ thống |
| `PROFILE_NOT_INITIALIZED` (403, EX.5) | Thông báo tài khoản chưa được khởi tạo hồ sơ, liên hệ Quản trị (không phải lỗi mật khẩu) |
| `TOO_MANY_REQUESTS` (429, EX.4) | Thông báo thử lại sau N giây |
| `SESSION_CREATE_FAILED` / `REQUEST_TIMEOUT` (EX.6) | Thông báo lỗi kết nối/hệ thống, giữ nguyên email đã nhập |
| `REFRESH_TOKEN_INVALID` (401, EX.7) | Xoá phiên, đưa về màn đăng nhập |
| `PASSWORD_CHANGE_REQUIRED` (403, AC.1/EX.8) | (Chưa có) mở form đổi mật khẩu; **chờ backend + migration** |

## 4. Việc còn lại

- **AC.1 mật khẩu tạm:** khi backend có `PASSWORD_CHANGE_REQUIRED` (cần migration, xem kế hoạch backend §6), FE mở form đổi mật khẩu (UC-IAM-04) và chặn điều hướng khác. **Chưa làm** cho tới khi backend sẵn sàng và Duy duyệt.
- **Ánh xạ i18n:** bảo đảm mọi mã lỗi trên có bản dịch vi/en ở `src/lib/i18n/` (`vi.ts` là nguồn, thiếu key en là lỗi biên dịch). Kiểm khi làm AC.1.
- **Áp design system mới:** màn đăng nhập nên dùng khoảnh khắc thương hiệu (tiêu đề `font-bricolage`) theo [product-design/20-design-system.md](../../product-design/20-design-system.md); tinh chỉnh nhỏ, không đổi luồng.

## 5. Kiểm thử

- **Vitest browser (đã có / bổ sung khi sửa):** form đăng nhập, `safe-redirect`, hiển thị lỗi theo `error.code`. `npx vitest run --browser.headless`.
- **Manual test (cổng Yêu cầu 3):** Duy đăng nhập ở `http://localhost:5175/sign-in`; kiểm vào đúng trang vai trò, các thông báo lỗi đúng, làm mới phiên hoạt động, đăng xuất về màn đăng nhập.
