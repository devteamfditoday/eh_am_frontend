# Kế hoạch triển khai frontend — UC-IAM-04: Đổi mật khẩu đang dùng

> **Yêu cầu 2 (frontend).** UC ở backend: `.../UC-IAM-04_doi-mat-khau-dang-dung.md`. **Đã có sẵn phần tự nguyện; phần mật khẩu tạm chờ backend + migration.**

## Mô tả tính năng
Trong **Hồ sơ cá nhân / Cài đặt bảo mật**, form ba ô: mật khẩu hiện tại, mật khẩu mới, nhập lại. Đổi xong backend thu hồi mọi phiên (`sessionsRevoked: true`) → FE xoá token, về `/sign-in`.

## Thành phần liên quan (đã có)
- `src/features/settings/security/` (LogoutAllSection và khu bảo mật), `password-input.tsx`.
- `src/lib/api/auth.api.ts` (change-password).

## Ánh xạ lỗi → UI
- `CURRENT_PASSWORD_INCORRECT` (EX.1) → lỗi ô mật khẩu hiện tại; `NEW_PASSWORD_SAME_AS_CURRENT` (EX.2) → lỗi ô mật khẩu mới; `VALIDATION_FAILED` (EX.3) → quy tắc mật khẩu; 429 (EX.5) chờ.
- Sau 200: bắt buộc xoá token + về `/sign-in`.

## Việc còn lại (chờ backend + migration)
Luồng **mật khẩu tạm** (AC.1/AC.2): khi backend có `PASSWORD_CHANGE_REQUIRED`, mở thẳng form đổi mật khẩu và chặn điều hướng khác. **Chưa làm** (cần migration + Duy duyệt — xem plan backend UC-IAM-04 §4).
