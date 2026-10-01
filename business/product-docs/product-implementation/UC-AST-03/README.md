# UC-AST-03 — Sửa thông tin mô tả tài sản (kế hoạch frontend)

- Trên `/assets/$id`, Quản lý tài sản thấy nút **Sửa thông tin mô tả** khi `readOnly=false`.
- Dialog `sm:max-w-2xl`: tên, loại, serial động, ghi chú; không có location/người chịu trách nhiệm/tài chính.
- Khi đổi loại khác `assetKind`, hiện khối lý do PROFILE_EDIT và bắt buộc chọn; lý do “Khác” mở ô ghi thêm.
- Gửi `profileVersion` hiện tại và idempotency key; thành công cập nhật cache detail/list và đóng dialog.
- `RECORD_VERSION_CONFLICT`: giữ dữ liệu, báo tải lại hồ sơ. Terminal/role lỗi: đóng dialog và refetch.
- Phần ảnh được bổ sung sau AST-06 khi có upload contract thật; không tạo input upload chưa hoạt động.
- i18n vi/en; label thật; error cạnh trường; focus trap, Escape, vùng chạm 44px mobile.

## Test

- Schema: tên/serial theo cờ loại, lý do khi đổi asset kind, normalize blank.
- Dialog: payload không chứa location/tài chính; lỗi version giữ dữ liệu; nút chỉ hiện đúng quyền/trạng thái.

