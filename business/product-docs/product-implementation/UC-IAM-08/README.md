# UC-IAM-08 — Cập nhật hồ sơ nhân viên (kế hoạch frontend)

## 1. Cấu trúc trang hồ sơ

Trang `/employees/$id` có bốn vùng theo thứ tự đọc:

1. header: tên, mã, trạng thái, **Sửa hồ sơ**, **Đổi email**, khóa/mở khóa;
2. tóm tắt liên hệ;
3. thông tin công việc và tuyến quản lý;
4. quyền truy cập hiện có (giữ bảng UC-IAM-10/11).

Desktop dùng hai card thông tin song song; mobile xếp một cột. Không biến trang thành dashboard
widget dày đặc, không thêm animation trang trí.

## 2. Form sửa hồ sơ

- Dialog lớn có hai section **Cá nhân** và **Công việc**, desktop hai cột, mobile một cột.
- Dùng chung `NumericInput` cho số điện thoại; select/location/department/manager dùng component
  chung, ngày dùng `DateField`.
- Đổi location hiển thị note rõ: vai trò không tự đổi, kèm link tới phần Quyền truy cập.
- Location OFFICE bắt buộc department; loại khác ẩn/xóa department.
- Manager selector loại chính mình và cấp dưới; hiển thị tuyến cấp trên để người quản trị soát.
- Không đổi gì: nút Lưu disabled hoặc toast “Không có thay đổi”; server vẫn là nguồn quyết định.
- Conflict version: đóng form cũ, refetch và mời mở lại; không tự merge.

## 3. Dialog đổi email

Email mới + lý do chuẩn + note khi “Khác”. Copy giải thích ảnh hưởng tới email đăng nhập và lời mời
đang chờ. Khi backend báo chưa đồng bộ Auth, trang vẫn hiện email hồ sơ mới cùng badge “Chờ đồng
bộ đăng nhập” và cảnh báo có hướng xử lý.

## 4. Accessibility / i18n / kiểm chứng

- Heading theo cấp, `<dl>` cho dữ liệu đọc, label/description/error liên kết đúng field.
- Touch target ≥44px, focus trap/restore, `aria-busy`, lỗi `role=alert`, không chỉ dùng màu.
- Toàn bộ copy vi/en, câu ngắn và nêu bước tiếp theo; không lộ tên nhà cung cấp xác thực.
- Test schema các ràng buộc liên trường, visibility/dirty state, conflict và sync warning; sau đó chạy
  toàn bộ typecheck/lint/Vitest/build.

