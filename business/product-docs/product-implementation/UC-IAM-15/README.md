# Kế hoạch frontend — UC-IAM-15: Tra cứu danh sách nhân viên

> Soạn trước code ngày 2026-10-01. Đọc cùng `DESIGN-README.md` và plan backend cùng mã UC.

## 1. Route và luồng

- Route quản trị mới: `/employees` (danh sách), chỉ hiện cho `SYSTEM_ADMIN`; nút "Thêm nhân viên" dẫn sang `/employees/new` (UC-IAM-05).
- Tải `GET /v1/employees` qua TanStack Query, key gồm toàn bộ tham số (search, các bộ lọc, page, pageSize) để cache đúng và quay lại trang giữ nguyên trạng thái.
- Trạng thái bộ lọc + từ khoá + trang lưu ở **URL search params** (TanStack Router) → chia sẻ link, F5 không mất, Back/Forward đúng.
- Ô tìm **debounce 300 ms** (khớp giả định của `THROTTLE_SEARCH` backend); mỗi phím không bắn một request.

## 2. Thành phần

- Dùng lại `Header`/`Main`, `SelectDropdown`, bảng dữ liệu TanStack Table (mẫu như các trang master-data), phân trang chung.
- Cột: Họ tên (+ mã nhân viên phụ dưới), Email, Địa điểm, Phòng ban, Chức danh, Trạng thái tài khoản (badge), Ngày vào làm. Dòng bấm được → mở hồ sơ (UC-IAM-14, tạm điều hướng `/employees/$id`).
- Thanh lọc: ô tìm, Địa điểm, Phòng ban, Vai trò, Trạng thái tài khoản, Loại hình. Có nút "Xoá lọc" khi có bộ lọc.
- Badge trạng thái tài khoản: Đã kích hoạt (ACTIVE), Chờ kích hoạt (PENDING_ACTIVATION), Đã khoá (SUSPENDED), Đã ngừng (DEACTIVATED). Khi Chờ kích hoạt: hiện thêm trạng thái lời mời (Đã gửi / Hết hạn) và **chỗ đặt** nút "Gửi lại lời mời" (hành vi ở UC-IAM-07).
- Enum → i18n bắt buộc (vi nguồn + en mirror cùng key): trạng thái tài khoản, trạng thái lời mời, loại hình, vai trò.

## 3. Nội dung và accessibility

- Trạng thái: tải (skeleton + `aria-busy`), rỗng (EX.1 — tổng 0, gợi ý bỏ bớt lọc, không coi là lỗi), lỗi/timeout (EX.5 — thông báo + nút "Tải lại", không hiện bảng trống như thể không có ai), 429 (EX.4 — giữ kết quả cũ, báo chờ).
- Bảng có `caption`/`aria-label`; badge không chỉ dùng màu làm tín hiệu (kèm chữ); touch target ≥ 44 px.
- Email/điện thoại là dữ liệu cá nhân — chỉ render trên trang quản trị này, không đưa vào tiêu đề/tooltip thừa.

## 4. TDD và kiểm chứng

- Test: đồng bộ bộ lọc ↔ URL params; debounce tìm; render badge trạng thái + nhánh Chờ kích hoạt (Đã gửi/Hết hạn); trạng thái rỗng/lỗi/429; phân trang.
- Sau GREEN: typecheck, lint, toàn bộ Vitest, production build, kiểm mobile/desktop + keyboard; chụp ảnh xác nhận layout theo `DESIGN-README.md`.
- Date hiển thị ngày vào làm dùng `date-fns` format (chỉ đọc); mọi ô **nhập** ngày ở các UC khác vẫn theo chuẩn #11 (`DateField`/`DateTimeField`).
