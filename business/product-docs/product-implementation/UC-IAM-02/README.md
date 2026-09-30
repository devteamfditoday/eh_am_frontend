# Kế hoạch triển khai frontend — UC-IAM-02: Đăng xuất

> **Yêu cầu 2 (frontend).** UC ở repo backend: `product-usecase/M01-nguoi-dung-phan-quyen/UC-IAM-02_dang-xuat-khoi-eh-am.md`. **Đã có sẵn.**

## Mô tả tính năng
Trong menu người dùng có **Đăng xuất** và **Đăng xuất khỏi tất cả thiết bị** (có hộp xác nhận). Đăng xuất gọi API thu hồi phiên, xoá token ở `sessionStorage`, đưa về `/sign-in`.

## Thành phần liên quan (đã có)
- `src/components/sign-out-dialog.tsx`, `profile-dropdown.tsx` (menu người dùng).
- `src/lib/api/auth.api.ts` (logout, logout-all), `auth-store.ts` (xoá phiên).
- Guard `_authenticated` đưa về `/sign-in` khi hết phiên.

## Ánh xạ lỗi → UI
- logout: kể cả 401/timeout (EX.1/EX.4) vẫn xoá token cục bộ + về `/sign-in`.
- logout-all: lỗi (EX.3) hoặc timeout (EX.6) thì **giữ** token, báo lỗi cho bấm lại; 429 (EX.5) báo chờ.

## Việc còn lại
Không có (đã có sẵn). Manual test: đăng xuất một thiết bị / mọi thiết bị.
