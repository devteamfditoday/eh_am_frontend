# UC-IAM-08 — DESIGN-README (hồ sơ nhân viên)

## 1. Trang hồ sơ — desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ← Nhân viên                                                                  │
│ Nguyễn Văn An  EH0123       [● Đang hoạt động] [Sửa hồ sơ] [Đổi email] [Khóa]│
├───────────────────────────────────┬──────────────────────────────────────────┤
│ LIÊN HỆ                           │ CÔNG VIỆC                                │
│ Email   an@everyhalf.vn            │ Địa điểm   CH01 · Cửa hàng Quận 1       │
│ Điện thoại 090 123 4567            │ Phòng ban  —                            │
│ Ngôn ngữ  Tiếng Việt               │ Chức danh  Quản lý cửa hàng              │
│                                    │ Cấp trên   Trần Minh B                   │
│                                    │ Loại hình  Toàn thời gian · 01/09/2026   │
├───────────────────────────────────┴──────────────────────────────────────────┤
│ Quyền truy cập                                         [+ Thêm vai trò]      │
│ ... bảng vai trò UC-IAM-10/11 ...                                            │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Card dùng border/radius/token hiện có, không gradient. Label nhỏ muted, value rõ và có thể copy.
- Nếu `authEmailSyncStatus != IN_SYNC`, email có badge cảnh báo + câu “Email đăng nhập đang được
  đồng bộ. Nếu kéo dài, báo bộ phận vận hành.”

## 2. Dialog sửa hồ sơ

```text
┌──────────────────────────────────────────────────────────────────┐
│ Sửa hồ sơ Nguyễn Văn An                                     [×] │
│ Thay đổi thông tin nhân sự; vai trò truy cập được giữ nguyên.    │
│                                                                  │
│ CÁ NHÂN                         CÔNG VIỆC                         │
│ Họ và tên * [...............]   Location * [................. ▾] │
│ Mã nhân viên [..............]   Phòng ban  [................. ▾] │
│ Số điện thoại [090 123...]      Chức danh  [...................] │
│ Ngôn ngữ [Tiếng Việt       ▾]   Loại hình [.................. ▾] │
│                                 Ngày vào làm [__/__/____]         │
│                                 Cấp trên [Tìm tên/mã......... ▾] │
│                                 Tuyến: Trần B → Lê C              │
│                                                                  │
│ [i] Đổi đơn vị không tự đổi vai trò. [Xem quyền truy cập]        │
│ Lý do (tùy chọn) [............................................] │
│                                             [Hủy] [Lưu thay đổi] │
└──────────────────────────────────────────────────────────────────┘
```

- `sm:max-w-4xl`, body cuộn trong viewport; footer luôn rõ. Khoảng cách section 24px, field 16px.
- Validation nằm dưới đúng field và giữ chiều cao ổn định theo component Form hiện có.

## 3. Dialog đổi email

```text
┌──────────────────────────────────────────────────────────────┐
│ Đổi email công việc                                      [×] │
│ Email này cũng dùng để đăng nhập. Với tài khoản chờ kích     │
│ hoạt, liên kết cũ sẽ hết hiệu lực và thư mới được gửi lại.    │
│ Email mới *       [........................................] │
│ Lý do *           [Chọn lý do                            ▾] │
│ Ghi chú *         [........................] (nếu “Khác”)   │
│                                    [Hủy] [Xác nhận đổi email]│
└──────────────────────────────────────────────────────────────┘
```

## 4. Responsive và trạng thái

| Trạng thái | Xử lý |
| --- | --- |
| Mobile | Cards và field một cột; action header wrap, mỗi nút cao ≥44px |
| Loading | Skeleton đúng hình card, không nhảy bố cục |
| Version conflict | Alert nêu hồ sơ đã đổi + CTA tải bản mới |
| No-op | Không gửi hoặc server trả `changed=false`; thông báo trung tính |
| Sync email lỗi | Giữ email mới, badge cảnh báo và hướng dẫn báo vận hành |

