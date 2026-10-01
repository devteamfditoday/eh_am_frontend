# UC-AST-08 — DESIGN-README

> Hướng thiết kế: hồ sơ vận hành tối giản, phân cấp rõ, kế thừa token Every Half. Không dùng GSAP cho trang dữ
> liệu dày; chuyển động chỉ là transition ngắn có sẵn của Collapsible và tôn trọng reduced motion.

## 1. Wireframe desktop

```text
← Danh sách tài sản

Máy pha cà phê Nuova Simonelli              [● Đang sử dụng] [Tốt]
TS000123                                    Hồ sơ đang hoạt động

┌──────────────────────────────┐  ┌──────────────────────────────┐
│ Thông tin tài sản            │  │ Vị trí và trách nhiệm        │
│ Loại       Máy pha cà phê    │  │ Địa điểm   Cửa hàng Quận 1   │
│ Serial     SN-001            │  │             Q1                │
│ Ghi chú    …                 │  │ Người giữ  Nguyễn Văn A       │
│ Ngày tạo   01/10/2026        │  │             NV001             │
└──────────────────────────────┘  │ Cost center CC-HCM · Vận hành│
                                  └──────────────────────────────┘
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ Thông tin mua                │  │ Tài chính *                  │
│ Ngày mua    20/09/2026       │  │ Số hóa đơn  HD-001           │
│ Nhà cung cấp Công ty ABC     │  └──────────────────────────────┘
└──────────────────────────────┘  * Ẩn hoàn toàn nếu không có quyền

┌─────────────────────────────────────────────────────────────────┐
│ Chứng từ                                                       │
│ Chưa có chứng từ đính kèm.                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Lịch sử tài sản                                                │
│ ● 01/10/2026  Tạo hồ sơ tài sản              [Xem chi tiết ▾] │
│   Nguyễn Văn A                                                │
│   └ Người thực hiện · Thời điểm · Trước → Sau · Lý do          │
│ ● …                                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Wireframe mobile

```text
← Danh sách
Máy pha cà phê…
TS000123
[● Đang sử dụng] [Tốt]

[ Thông tin tài sản       ]
[ Vị trí và trách nhiệm   ]
[ Thông tin mua           ]
[ Tài chính *             ]
[ Chứng từ — chưa có      ]
[ Lịch sử                 ]
  ● Tạo hồ sơ
    01/10/2026 · Nguyễn…
    [Xem chi tiết       ▾]
```

## 3. Trạng thái màn hình

| Trạng thái | Trình bày |
| --- | --- |
| Đang tải | skeleton header + 4 card, `aria-busy=true` |
| Ngoài phạm vi / không tồn tại | icon hồ sơ, “Không tìm thấy tài sản”, nút về danh sách; không tiết lộ phạm vi |
| Lỗi mạng/server | EmptyState lỗi, Thử lại + về danh sách |
| Chứng từ rỗng | nội dung rỗng trong card, không có nút tải |
| Timeline rỗng bất thường | thông báo trung tính, phần hồ sơ vẫn dùng được |
| Hồ sơ kết thúc | badge danger + nhãn chỉ xem; không có action sửa |

## 4. Token, tương tác và a11y

- Dùng `Card`, `StatusBadge`, `DescriptionList`, `CodeText`, `Collapsible`, không thêm bảng màu/font mới.
- Khoảng cách 4/6; card border nhẹ, không gradient, không bóng dày; vùng nội dung tối đa theo `Main` hiện hữu.
- Link và nút có cursor/focus đúng ngữ cảnh; không biến toàn card thành vùng click mơ hồ.
- Timeline dùng đường trục bằng border token, không dùng emoji; màu không phải tín hiệu duy nhất vì luôn có nhãn chữ.
- Nội dung thay đổi được công bố tự nhiên qua trạng thái query; animation bị vô hiệu khi `prefers-reduced-motion`.

