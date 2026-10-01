# Kế hoạch frontend — UC-IAM-06: Kích hoạt tài khoản được mời

> Soạn trước code ngày 2026-10-01. Đọc cùng `DESIGN-README.md` và plan backend cùng mã UC.
>
> **Trạng thái: XONG, đã kiểm chứng.** typecheck 0 · lint 0 error · build OK · vitest 154/154. Route `(auth)/activate-account` + feature `activate-account/`. Chờ Duy chạy migration 04 backend + manual test.

## 1. Route và trạng thái

- Route công khai `/activate-account`, dùng chung `AuthLayout`; không cần và không được giữ phiên đăng nhập ứng dụng.
- Parser chỉ nhận fragment `type=invite`, giới hạn token 4096 ký tự và xoá fragment khỏi thanh địa chỉ ngay lần render đầu.
- Tải preview trước khi mở form. Có bốn trạng thái rõ: đang kiểm tra, form hợp lệ, liên kết không còn dùng được, kích hoạt thành công.
- Thành công thay toàn bộ form bằng xác nhận và nút **Đăng nhập**; không tự đăng nhập để mọi phiên đi qua UC-IAM-01.

## 2. Form và nội dung

- Họ tên và email chỉ đọc trong khối nhận diện gọn; không dùng disabled input vì khó đọc và không cần gửi lại.
- Hai ô mật khẩu dùng `PasswordInput`, cùng password policy common; xác nhận mật khẩu được kiểm ở client nhưng backend chỉ nhận mật khẩu mới.
- Lỗi hết hạn hướng dẫn liên hệ quản trị để gửi lại; liên kết đã dùng hướng tới đăng nhập; liên kết sai chỉ nói không còn dùng được, không lộ tài khoản.
- Nút chính có vùng chạm 44 px, `aria-busy`; lỗi server `role="alert"`; thành công `role="status"`; focus chuyển vào heading/trạng thái sau mỗi pha.

## 3. Thành phần dùng chung và chuyển động

- Tái sử dụng `AuthLayout`, `PasswordInput`, password policy, API error handler và Card hiện có; parser activation tách file thuần để test.
- Không tạo component chung mới nếu chỉ màn này dùng. Nếu khối trạng thái liên kết được dùng lại ở UC-IAM-07 mới nâng lên common.
- Không thêm GSAP trong form. Brand panel đã có GSAP và hỗ trợ `prefers-reduced-motion`; form chỉ dùng transition màu/focus của design system.

## 4. TDD và kiểm chứng

- RED: parser từ chối recovery/sai/error/hash quá dài; schema chặn mật khẩu yếu/không khớp; trạng thái expired/used/invalid; submit một lần; thành công dẫn về sign-in.
- GREEN: test đích rồi full Vitest, typecheck, lint, production build; kiểm bàn phím, screen reader, mobile 360 px và desktop.

## 5. Cấu hình môi trường cần kiểm khi manual test

- Supabase Dashboard phải cho phép redirect chính xác `http://localhost:5175/activate-account` ở môi trường dev (production dùng origin tương ứng). Nếu không, Supabase im lặng bỏ qua `redirectTo` và đưa người dùng về Site URL.
- Email OTP Expiration trên Dashboard phải khớp `SUPABASE_EMAIL_OTP_EXPIRY_SECONDS` của backend; mặc định cả hai là 3600 giây.
