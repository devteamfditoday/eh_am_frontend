# Kế hoạch triển khai frontend — UC-IAM-03: Đặt lại mật khẩu khi quên

> **Yêu cầu 2 (frontend).** UC ở backend: `.../UC-IAM-03_dat-lai-mat-khau-khi-quen.md`. **Đã có sẵn.**

## Mô tả tính năng
Từ `/sign-in` bấm **Quên mật khẩu?** → `/forgot-password` nhập email → nhận thư → mở liên kết `/reset-password` (mã khôi phục trong URL, đọc một lần rồi xoá khỏi URL) → nhập mật khẩu mới → về `/sign-in`.

## Thành phần liên quan (đã có)
- `src/features/auth/forgot-password/`, `reset-password/` (form + `recovery-token.ts` đọc token an toàn).
- `src/lib/api/auth.api.ts` (forgot-password, reset-password).

## Ánh xạ lỗi → UI
- forgot-password: luôn hiện câu chung (không lộ email có tồn tại) — EX.2.
- reset-password: `RECOVERY_TOKEN_INVALID` (EX.5) → mời xin liên kết mới; `VALIDATION_FAILED` (EX.6) → lỗi theo ô; **`ACCOUNT_INACTIVE` (EX.8, backend mới vá)** → báo tài khoản bị khoá, liên hệ Quản trị.

## Việc còn lại
Bảo đảm i18n có thông điệp cho `ACCOUNT_INACTIVE` ở màn reset (kiểm khi rà i18n). Manual test: quên → đặt lại; thử tài khoản khoá → bị từ chối.
