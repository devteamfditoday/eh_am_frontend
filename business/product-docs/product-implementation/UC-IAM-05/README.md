# Kế hoạch triển khai frontend — UC-IAM-05: Thêm nhân viên mới

> **Yêu cầu 2 (frontend) — bản để Duy duyệt trước.** UC ở backend: `.../UC-IAM-05_them-nhan-vien-moi.md`. **Chưa dựng.** Phụ thuộc nền M02 và các quyết định ở plan backend §5 (đọc trước).

## 1. Mô tả tính năng
Màn **Thêm nhân viên** dạng **wizard 4 bước** cho Quản trị hệ thống, mở từ **Danh sách nhân viên**:

1. **Đơn vị công tác:** location chính (bắt buộc), phòng ban (bắt buộc khi location là văn phòng, ẩn với loại khác — QĐ-13).
2. **Thông tin cá nhân:** họ tên, email công việc (bắt buộc, cũng là tên đăng nhập), điện thoại, ngôn ngữ (mặc định vi).
3. **Chi tiết công việc** (không bắt buộc): mã nhân viên, chức danh, loại hình làm việc, ngày vào làm, cấp trên trực tiếp.
4. **Tài khoản và vai trò ban đầu:** cách kích hoạt (mời email / mật khẩu tạm), vai trò ban đầu + phạm vi + hiệu lực + lý do (chọn từ danh mục, bắt buộc khi có vai trò).

Sau bước 4: **tóm tắt** cả 4 bước → **Tạo tài khoản** (gửi kèm idempotency key) → mở **Hồ sơ nhân viên** (Chờ kích hoạt). Nhánh mật khẩu tạm: hiện mật khẩu một lần.

## 2. Component cần dựng (Yêu cầu 1 đã có nền)
- `WizardStepper` (thanh tiến trình 4 bước, điều hướng, giữ dữ liệu khi Quay lại — AC.3) — mẫu ghi ở `product-design/30-common-components.md §4`.
- Form từng bước dùng `react-hook-form` + `zod` (đã có), kiểm ở client bằng danh mục đã tải (QĐ-17: không có API kiểm riêng từng bước).
- `PageHeader`, `StatusBadge` (Chờ kích hoạt = tone warning), `CodeText` (mã nhân viên), `DescriptionList` (bước tóm tắt) — đã có.
- Select location/phòng ban/cấp trên/lý do: dùng danh mục M02 (chờ M02).

## 3. Ánh xạ lỗi → UI (theo EX của UC)
`VALIDATION_FAILED` + mã ô (REQUIRED_FIELD_MISSING, INVALID_SUPERIOR, REASON_INVALID, VALUE_OUT_OF_DOMAIN) → lỗi theo ô; `EMAIL_ALREADY_REGISTERED` (409) → lỗi ô email, mời mở hồ sơ đã có; `EMPLOYEE_CODE_TAKEN` (409); `ROLE_REQUIRED`/`ROLE_NOT_ASSIGNABLE` (403); `EMAIL_SEND_FAILED` (502) → tài khoản đã tạo, báo dùng UC-IAM-07 gửi lại; timeout → tra Danh sách nhân viên trước khi tạo lại (EX.5).

## 4. Chờ trước khi dựng
- Nền M02 (danh mục location/phòng ban/lý do) để đổ vào các ô chọn.
- Chốt tên API (`/v1/employees`) và bộ vai trò (plan backend §5).
- i18n vi/en cho toàn bộ nhãn wizard + mã lỗi mới.
