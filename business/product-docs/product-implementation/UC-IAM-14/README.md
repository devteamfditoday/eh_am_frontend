# UC-IAM-14 — Hồ sơ cá nhân và ngôn ngữ (Frontend)

## Mục tiêu

Trang `/profile` giúp người đang đăng nhập xem thông tin nhân sự chỉ đọc, đơn vị/cấp trên và các vai trò theo phạm vi. Người dùng chỉ có thể đổi ngôn ngữ Việt/Anh tại đây.

## Luồng màn hình

1. Mở **Hồ sơ cá nhân** từ menu tài khoản.
2. Dùng dữ liệu `GET /auth/me`; không gửi mã nhân viên hay user ID.
3. Hiển thị thông tin cá nhân/công việc và danh sách vai trò. Nếu chưa có vai trò, hướng dẫn liên hệ Quản trị hệ thống và nói rõ chưa thể xem dữ liệu location.
4. Chọn ngôn ngữ rồi bấm lưu.
5. Chỉ sau khi `PATCH /auth/me/locale` thành công mới cập nhật auth store, cache và `i18next`; nếu lỗi, giao diện giữ nguyên ngôn ngữ cũ.

## Thành phần

- Route mỏng `src/routes/_authenticated/profile.tsx`.
- `PersonalProfilePage`: Header/Main chuẩn, thẻ hồ sơ, công việc, quyền truy cập và ngôn ngữ.
- API `updatePreferredLocale` và mở rộng mapper `fetchMe`.
- Liên kết **Hồ sơ cá nhân** trong `ProfileDropdown`.
- Mã vai trò, loại phạm vi, loại nhân sự được ánh xạ qua i18n; ngày hiệu lực dùng formatter locale, không hiển thị enum thô.

## Trạng thái và lỗi

- Loading dùng skeleton có cấu trúc ổn định.
- Lỗi tải hồ sơ có nút thử lại.
- Lưu ngôn ngữ có `aria-busy`, khóa lựa chọn/nút trong lúc chờ.
- Không có vai trò dùng empty state có hướng dẫn cụ thể, không biến thành lỗi toàn trang.
- API 401/403 đi theo cơ chế phiên và error handler chung; timeout không đổi ngôn ngữ local.

## Kiểm thử

- TDD cho chuẩn hóa response và cập nhật locale.
- Kiểm tra nhãn, quan hệ label-control, trạng thái pending và nội dung hai ngôn ngữ.
- Typecheck, ESLint, Vitest browser và Vite build.

