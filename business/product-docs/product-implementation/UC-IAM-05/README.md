# Kế hoạch frontend — UC-IAM-05: Thêm nhân viên mới

> Soạn trước code ngày 2026-10-01. Đọc cùng `DESIGN-README.md` và plan backend cùng mã UC.

## 1. Route và luồng

- Route quản trị: `/employees/new`, chỉ hiện cho `SYSTEM_ADMIN`.
- Tải một lần `GET /v1/employees/create-options`; từng bước kiểm bằng Zod trên tập option đang hoạt động.
- Wizard 4 bước giữ dữ liệu khi quay lại, rà soát ở bước 4, chỉ `POST /v1/employees` một lần với UUID idempotency ổn định.
- Thành công hiển thị trạng thái Chờ kích hoạt và kết quả gửi lời mời. Mật khẩu tạm không nằm trong URL, toast hay log.

## 2. Thành phần

- Common mới: `FormWizard`/`WizardStepper`; hỗ trợ bàn phím, `aria-current="step"`, trạng thái hoàn tất/lỗi và mobile.
- React Hook Form + Zod; số điện thoại dùng `NumericInput` common.
- Step 1 location/phòng ban phụ thuộc; đổi khỏi OFFICE xoá department.
- Step 2 họ tên, email, điện thoại, ngôn ngữ.
- Step 3 mã nhân viên, chức danh, loại hình, ngày vào làm, cấp trên.
- Step 4 cách kích hoạt, vai trò, phạm vi/hiệu lực, lý do và tóm tắt có nút sửa từng nhóm.

## 3. Nội dung và accessibility

- Câu chữ ngắn, nói rõ hệ quả: “Chưa gán vai trò” và “Nhân viên chưa xem được dữ liệu location nào”.
- Label thật, lỗi nối bằng `aria-describedby`, focus ô lỗi đầu tiên; stepper là danh sách có tên và `aria-current`.
- Loading dùng `aria-busy`, lỗi server dùng `role="alert"`, touch target tối thiểu 44 px.
- Không dùng GSAP: wizard nghiệp vụ cần phản hồi tức thì; chỉ transition CSS nhẹ và tôn trọng reduced-motion.

## 4. TDD và kiểm chứng

- Test schema từng bước, reset department, role/reason có điều kiện, payload normalization, double-click chỉ tạo một lệnh, mapping lỗi email/mã nhân viên.
- Sau GREEN: typecheck, lint, toàn bộ Vitest, production build, mobile/desktop và keyboard path.
