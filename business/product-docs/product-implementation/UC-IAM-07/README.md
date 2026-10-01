# UC-IAM-07 — Gửi lại lời mời kích hoạt (Frontend)

## Phạm vi

Tận dụng màn hình `/employees` của UC-IAM-15. Không tạo trang hồ sơ mới. Nút **Gửi lại lời mời** chỉ xuất hiện với nhân viên `PENDING_ACTIVATION` có `inviteStatus`; tài khoản mật khẩu tạm không có nút.

## Luồng giao diện

1. Quản trị viên bấm **Gửi lại lời mời** tại dòng nhân viên.
2. Dialog nêu rõ email nhận và lời mời cũ sẽ mất hiệu lực.
3. Khi xác nhận, client sinh UUID cho lần bấm, gọi `POST /employees/:id/resend-invite` với `Idempotency-Key` và khóa nút trong lúc chờ.
4. Thành công: đóng dialog, hiện toast có thời điểm gửi, rồi làm mới danh sách.
5. `ACCOUNT_STATE_CONFLICT`: đóng dialog, báo trạng thái đã đổi và làm mới danh sách.
6. `EMAIL_SEND_FAILED`: báo lời mời mới đã được lưu nhưng email chưa chuyển đi; danh sách được làm mới.
7. Timeout/mất mạng: nhắc người dùng làm mới để xem lời mời gần nhất trước khi thử lại.

## Thành phần và API

- `employees.api.ts`: `resendEmployeeInvite(employeeId, commandKey)`.
- `employees-list-page.tsx`: giữ target, mutation, dialog, toast và invalidation.
- `employees-columns.tsx`: nhận callback; action chỉ render khi đủ điều kiện.
- Dùng `ConfirmDialog` chung, focus trap/Esc/return focus từ Radix; nút chờ có `aria-busy`.
- Chuỗi vi/en đặt trong i18n và được viết theo ngôn ngữ hành động của người dùng.

## Kiểm thử

- RED trước cho điều kiện hiện action và callback.
- RED trước cho dialog/mutation, idempotency key, success/conflict/email failure.
- Chạy Vitest browser, typecheck, lint và build.

