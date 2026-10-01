# UC-IAM-12 — Khóa hoặc mở khóa tài khoản (kế hoạch frontend)

## 1. Vị trí và hành vi

- Hành động nằm trong phần đầu trang **Hồ sơ nhân viên / Quyền truy cập**, cạnh nhãn trạng thái để
  người quản trị thấy rõ đối tượng và trạng thái trước khi bấm.
- `ACTIVE` hiện **Khóa tài khoản**; `SUSPENDED` hiện **Mở khóa tài khoản**. `PENDING_ACTIVATION`,
  `DEACTIVATED` và hồ sơ của chính người đang đăng nhập không hiện hành động.
- Dialog dùng danh mục lý do đúng nhóm. Nếu lý do là **Khác**, ô ghi chú xuất hiện và bắt buộc.
- Thành công: toast, đóng dialog, refetch hồ sơ; trạng thái mới đồng bộ ngay trên danh sách và sơ đồ
  qua lần query kế tiếp. Nếu backend báo chưa thu hồi hết phiên, toast cảnh báo nói rõ tài khoản đã bị
  chặn nhưng quản trị viên nên báo vận hành.
- Xung đột trạng thái / quản trị viên cuối cùng: giữ dialog, hiện lỗi dễ hiểu và refetch hồ sơ.

## 2. Thành phần và tái sử dụng

- Thêm `AccountStatusDialog` riêng trong feature `employees/access`; tái dùng `Dialog`, `Select`,
  `Textarea`, `FormField` và cơ chế hiển thị lỗi hiện có.
- API `changeEmployeeAccountStatus()` luôn gửi `Idempotency-Key` mới cho mỗi lần mở dialog và giữ
  nguyên key trong lúc retry cùng một ý định.
- Không thêm animation vào màn hình quản trị dày thông tin. Chỉ dùng transition sẵn có của Dialog.

## 3. Trạng thái và accessibility

- Nút hành động có chữ + icon, vùng bấm tối thiểu 44px và cursor đúng ngữ cảnh.
- Dialog có tiêu đề/description nêu tên nhân viên, hậu quả lên phiên và việc giữ nguyên vai trò.
- Label liên kết input; lỗi inline có `role="alert"`; loading dùng spinner, `aria-busy`, khóa submit
  nhưng vẫn cho trình đọc màn hình biết đang xử lý.
- Focus trap, Esc/Cancel và hoàn focus theo primitive `Dialog`; không dựa vào màu để truyền trạng thái.
- Mobile: header xếp dọc, nút rộng toàn hàng; dialog cuộn nội dung, footer luôn đọc được.

## 4. TDD và kiểm chứng

1. Test đỏ schema: bắt buộc lý do, bắt buộc ghi chú cho lý do tự do.
2. Test component cho khả năng hiển thị hành động theo trạng thái/chính mình và payload API.
3. Làm xanh, sau đó typecheck, lint, toàn bộ Vitest, build và kiểm tra i18n vi/en cùng a11y.

