# Wireframe — Đổi người chịu trách nhiệm

```text
┌──────────────────────────────────────────────────────────┐
│ Đổi người chịu trách nhiệm                         [×]   │
│ TS000123 · Máy pha cà phê                                │
│                                                          │
│ Người hiện tại                                           │
│ Nguyễn An · EH0012                         (chỉ đọc)      │
│                                                          │
│ Người chịu trách nhiệm mới *                             │
│ [ Chọn người tại địa điểm này                         ▾ ] │
│                                                          │
│ Lý do *                                                  │
│ [ Chọn lý do                                          ▾ ] │
│ Ghi chú lý do                                            │
│ [                                                     ]  │
│                                                          │
│                              [Huỷ] [Xác nhận đổi]         │
└──────────────────────────────────────────────────────────┘
```

- Desktop tối đa 640px; mobile full chiều rộng khả dụng, footer xuống dòng khi cần.
- Không dùng animation/GSAP: đây là tác vụ ghi dữ liệu ngắn, phản hồi trạng thái qua pending/error/toast rõ hơn chuyển động trang trí.
- Dùng common `Dialog`, `SelectDropdown`, `Form`, `StatusBadge`; không tạo select/dialog riêng. Người hiện tại được đặt trong khối nền nhẹ để tránh nhầm với input có thể sửa.
