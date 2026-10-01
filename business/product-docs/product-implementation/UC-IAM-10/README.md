# UC-IAM-10 — Gán vai trò theo phạm vi (Frontend)

## Màn hình và luồng

- Route `/employees/$employeeId` là hồ sơ quản trị, tab quyền hiển thị lịch sử
  assignment và nhãn Sắp hiệu lực/Đang hiệu lực/Hết hiệu lực/Đã thu hồi.
- Nút “Thêm vai trò” mở dialog. Role toàn hệ thống tự khóa scope PLATFORM;
  role theo điểm mới hiện danh sách location ACTIVE.
- `LOCATION_MANAGER` cho chọn nhiều location; `LOCATION_STAFF` chỉ một.
- Ngày dùng `DateField`, không dùng input date native. Lý do bắt buộc.
- Thành công đóng dialog, làm mới hồ sơ; lỗi overlap/stale data giữ nguyên dữ
  liệu đã nhập và giải thích cách xử lý.

## Thành phần/API

- `EmployeeAccessPage`, `RoleAssignmentsList`, `GrantRoleDialog`.
- `GET /employees/:id/access`, `POST /employees/:id/role-assignments`.
- Dùng `StatusBadge`, `CodeText`, `DateField`, common dialog/form primitives.

## TDD

- Schema chặn thiếu location, nhiều location cho LOCATION_STAFF, ngày đảo và lý
  do rỗng.
- Role PLATFORM không gửi location; LOCATION_MANAGER gửi đủ danh sách.
- Lỗi API giữ dialog/form, success refresh danh sách.
