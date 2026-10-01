# UC-IAM-11 — Thu hồi vai trò theo location (kế hoạch kỹ thuật frontend)

> Mở rộng màn hình **Hồ sơ nhân viên → Quyền truy cập** của UC-IAM-10. Không thêm route mới; thêm
> một cột thao tác + hộp thoại xác nhận thu hồi.

## 1. Thay đổi

- `src/lib/api/employees.api.ts`: thêm `revokeRoleAssignment(employeeId, assignmentId, reason, commandKey)`
  → `POST /employees/:id/role-assignments/:assignmentId/revoke` kèm `Idempotency-Key`.
- `src/features/employees/access/revoke-role-dialog.tsx`: hộp thoại xác nhận (tóm tắt vai trò +
  phạm vi + nhân viên, ô lý do bắt buộc ≥2 ký tự, nút Xác nhận thu hồi màu cảnh báo).
- `src/features/employees/access/employee-access-page.tsx`: thêm cột **Thao tác**; nút **Thu hồi**
  chỉ hiện ở dòng `ACTIVE`/`UPCOMING` và `roleCode !== SYSTEM_ADMIN` (EX.3 chỉ là tiện ích giao
  diện — server vẫn chặn); mở `RevokeRoleDialog` theo dòng được chọn.
- i18n `employees.access.revoke.*` + `columns.actions` (vi nguồn, en mirror cùng khoá).

## 2. Hành vi

- Bấm **Thu hồi** → hộp thoại nêu rõ "Thu hồi {vai trò} ở {phạm vi} của {tên}". Nhập lý do, bấm
  **Xác nhận thu hồi**.
- Thành công → toast, `invalidateQueries(employeeKeys.access(id))` để bảng cập nhật nhãn
  **Đã thu hồi**, đóng hộp thoại.
- Lỗi → hiện thông báo của server (đã địa phương hoá theo `code`). Riêng `HISTORY_IMMUTABLE`
  (EX.1 — dòng vừa bị người khác đóng) còn refetch để nhãn hiển thị sự thật.
- `Idempotency-Key` cố định cho mỗi lần mở (bấm đúp không tạo hai lệnh); `key={assignmentId}` để mở
  lại cho dòng khác thì cấp khoá mới.

## 3. Trạng thái

| Trạng thái | Xử lý |
| --- | --- |
| Đang gửi | nút quay `Loader2`, `aria-busy`, khoá nút |
| Lỗi nghiệp vụ | khối cảnh báo `role=alert` trong hộp thoại, giữ ô lý do |
| Xung đột (EX.1) | thông báo + tự refetch danh sách |
| Rỗng/hết hiệu lực | dòng `EXPIRED`/`REVOKED` không có nút Thu hồi |

## 4. A11y / responsive

- Hộp thoại dùng `Dialog` (focus trap, Esc đóng). `DialogDescription` mô tả hành động. Ô lý do có
  `<Label htmlFor>`.
- Nút Thu hồi `size='sm'`, cột căn phải; bảng cuộn ngang trên mobile như UC-IAM-10.
- Nút xác nhận `variant='destructive'` để nhấn mạnh hành động cắt quyền.
