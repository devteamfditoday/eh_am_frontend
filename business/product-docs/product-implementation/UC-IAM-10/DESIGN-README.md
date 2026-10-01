# UC-IAM-10 — Thiết kế hồ sơ và dialog gán vai trò

## Desktop

```text
┌ Header ─────────────────────────────────────────────────────────────┐
├ Main ───────────────────────────────────────────────────────────────┤
│ ← Nhân viên                                                        │
│ Nguyễn Văn An · EH001                          [Đang hoạt động]      │
│ Văn phòng · Vận hành                                               │
│                                                                    │
│ Quyền truy cập                                  [ + Thêm vai trò ] │
│ ┌ Vai trò ─────────┬ Phạm vi ─────┬ Hiệu lực ─────┬ Trạng thái ──┐ │
│ │ Quản lý điểm     │ Cửa hàng A   │ 01/10 — ...   │ Đang hiệu lực│ │
│ └──────────────────┴───────────────┴────────────────┴───────────────┘ │
└────────────────────────────────────────────────────────────────────┘

Dialog (sm:max-w-2xl)
┌ Gán vai trò ───────────────────────────────────────────────────────┐
│ Vai trò * [ Quản lý điểm                                      ▾ ] │
│ Phạm vi: Theo location                                            │
│ Location * [ ] Cửa hàng A  [ ] Kho B                              │
│ Hiệu lực từ * [ DateField ]   Hiệu lực đến [ DateField ]          │
│ Lý do * [                                                     ]   │
│                                    Huỷ       [ Gán vai trò ]       │
└────────────────────────────────────────────────────────────────────┘
```

## Mobile

Hồ sơ xếp một cột; danh sách quyền chuyển thành các hàng nhãn–giá trị, không ép
bảng tràn trang. Dialog gần toàn chiều rộng; cặp ngày xếp dọc. Vùng chạm >=44px.

## Trạng thái và a11y

- Loading skeleton; lỗi có Tải lại; chưa có role vẫn có CTA “Thêm vai trò”.
- Field row dùng `items-start`, message có vùng dự phòng để không lệch layout.
- Dialog focus trap/Esc/return focus theo Radix; submit có `aria-busy`.
- Nhãn trạng thái có chữ, không chỉ màu; enum role/context/status đều qua i18n.
- Chuyển động dùng primitive hiện hữu, tôn trọng reduced motion; không GSAP.
