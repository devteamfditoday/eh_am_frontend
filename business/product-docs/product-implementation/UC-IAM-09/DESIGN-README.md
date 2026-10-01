# UC-IAM-09 — Thiết kế sơ đồ tổ chức

## Hướng thiết kế

Màn vận hành nội bộ, “mực trên giấy”, yên tĩnh và dễ quét. Canvas dùng
`@xyflow/react` theo pattern đã kiểm chứng ở FDI Today (pan/zoom, controls,
smooth-step edge và layout tidy-tree tất định). Cây là nội dung
chính; cảnh báo dữ liệu là một dải công việc bên cạnh, không dùng dashboard KPI
hay card lồng card. Dùng token hiện hữu, Lucide, Radix/shadcn và chuyển động CSS
ngắn; không dùng GSAP trên màn dữ liệu.

## Desktop

```text
┌ Header ───────────────────────────────────────────────────────────────┐
│                                                     theme  config user │
├ Main ─────────────────────────────────────────────────────────────────┤
│ Sơ đồ tổ chức                                      [chỉ đọc · không cấp quyền]
│ Xem quan hệ báo cáo và những hồ sơ cần hoàn thiện.                    │
│                                                                      │
│ [ Tìm tên hoặc mã nhân viên…              ] [Số cấp: Toàn bộ ▾]      │
│ 4 kết quả                                                            │
│                                                                      │
│ ┌ vùng cây cuộn ngang khi thật sự cần ─────────┐  Dữ liệu cần hoàn thiện
│ │                ┌ Every Half ┐                │  ┌──────────────────┐
│ │                       │                      │  │ Nguyễn… · EH012  │
│ │          ┌────────────┴────────────┐         │  │ Thiếu cấp trên   │
│ │   [−] An · EH001          [+] Bình · EH002   │  ├──────────────────┤
│ │        ACTIVE             TẠM KHÓA           │  │ Trần… · EH019    │
│ │          │                                    │  │ Vòng cấp trên    │
│ │   [−] Chi · EH003                              │  └──────────────────┘
│ └───────────────────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
```

Thẻ rộng ổn định, tên là tiêu điểm; mã dùng `CodeText`, chức danh/đơn vị là
thông tin phụ. Đường nối chỉ là border token, không dựa vào màu để diễn đạt.
Khối cảnh báo là danh sách có divider, không bọc thêm nhiều lớp card.

## Mobile

```text
┌ Header ─────────────────────┐
│ Sơ đồ tổ chức               │
│ [ Tìm tên hoặc mã…        ] │
│ [ Số cấp: 2              ▾ ]│
│ 0 kết quả · Thử từ khóa khác│
│                             │
│ ┌ vùng cây cuộn ngang ─────┐│
│ │       Every Half         ││
│ │          │               ││
│ │   [−] Nguyễn Văn An      ││
│ │       EH001 · Đang HĐ    ││
│ └──────────────────────────┘│
│                             │
│ Dữ liệu cần hoàn thiện      │
│ Nguyễn…  Thiếu đơn vị       │
└─────────────────────────────┘
```

Toolbar xếp một cột. Chỉ vùng cây được cuộn ngang; trang không tràn ngang.
Nút mở/gập và thẻ có vùng chạm tối thiểu 44px.

## Trạng thái

- Tải: skeleton có kích thước cố định, `role=status`, `aria-busy=true`.
- Lỗi: không giữ cây cũ như dữ liệu đầy đủ; minh họa đơn sắc + “Tải lại”.
- Rỗng: thông báo chưa có hồ sơ chưa ngừng, CTA về “Thêm nhân viên” chỉ cho
  quản trị.
- Tìm không khớp: `0 kết quả`, cây giữ nguyên độ nhấn.
- Có vòng: phần cây lành vẫn hiện; cảnh báo vòng có icon + chữ.
- Chi tiết mở: vùng ngay dưới nội dung thẻ, `aria-expanded`; không dùng dialog.

## Accessibility và responsive

- Cấu trúc cây bằng danh sách lồng nhau; nút mở/gập có accessible name và
  `aria-expanded`. Focus ring dùng token chung.
- Trạng thái có chữ và chấm; icon cạnh chữ là trang trí `aria-hidden`.
- Highlight dùng `<mark>` nhưng vẫn giữ nguyên chuỗi đọc bởi screen reader.
- Tương phản chữ 4.5:1; dark mode dùng semantic token, không hardcode màu.
- `prefers-reduced-motion` được tôn trọng; không có animation thiết yếu.
