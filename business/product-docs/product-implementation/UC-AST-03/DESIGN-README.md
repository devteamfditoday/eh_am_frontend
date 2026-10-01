# UC-AST-03 — DESIGN-README

```text
┌──────────────────────────────────────────────────────────┐
│ Sửa thông tin mô tả                                  [×] │
│ Chỉ sửa thông tin nhận diện; địa điểm được đổi qua       │
│ quy trình điều chuyển.                                   │
├──────────────────────────────────────────────────────────┤
│ Tên tài sản *                                            │
│ [ Máy pha cà phê Nuova Simonelli                     ]   │
│                                                          │
│ Loại tài sản *                  Serial *                  │
│ [ Máy pha cà phê           ▾]   [ SN-001             ]   │
│                                                          │
│ Ghi chú                                                  │
│ [ ...                                                ]   │
│                                                          │
│ ┌ Lý do đổi nhóm hạch toán ────────────────────────────┐ │
│ │ Lý do * [ Chọn lý do ▾ ]                            │ │
│ │ Ghi thêm * [ ... ] (chỉ khi chọn Khác)              │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│                         Huỷ       [ Lưu thay đổi ]        │
└──────────────────────────────────────────────────────────┘
```

- Khối lý do chỉ xuất hiện khi loại mới đổi `assetKind`, tránh làm form thường ngày nặng nề.
- Mobile: mọi trường một cột, footer sticky trong dialog, nút cao tối thiểu 44px.
- Loading options: skeleton/disable submit; lỗi options có Thử lại. Version conflict là alert trong dialog, không
  xoá dữ liệu người dùng vừa nhập.
- Dùng Dialog/Form/Input/Select/Textarea/RequiredMark có sẵn; không animation trang trí, không gradient.
- Ảnh chưa vẽ control giả. Sau AST-06, bổ sung vùng preview + thay ảnh bằng upload contract thật và cập nhật file này.

