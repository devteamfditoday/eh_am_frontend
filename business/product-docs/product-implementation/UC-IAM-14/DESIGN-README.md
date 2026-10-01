# UC-IAM-14 — Thiết kế giao diện hồ sơ cá nhân

## Định hướng

Màn hình quản trị nhẹ, dễ quét: phần nhận diện ở đầu, thông tin được chia theo ý nghĩa thay vì một form dài. Dùng token nền/viền/chữ của hệ thống, không thêm màu trang trí hoặc chuyển động gây xao nhãng.

## Wireframe desktop

```text
┌ Header ───────────────── Search · Theme · Config · Avatar ┐
├ Main ─────────────────────────────────────────────────────┤
│ Hồ sơ cá nhân                                              │
│ Kiểm tra thông tin công việc và ngôn ngữ bạn đang dùng.    │
│                                                            │
│ ┌ Nhận diện ────────────────┐ ┌ Ngôn ngữ ────────────────┐ │
│ │ [AV] Nguyễn Văn A          │ │ Ngôn ngữ hiển thị         │ │
│ │ NV001 · a@everyhalf.vn     │ │ (•) Tiếng Việt            │ │
│ │ Điện thoại · Chức danh     │ │ ( ) English               │ │
│ └────────────────────────────┘ │                 [Lưu]     │ │
│                                └───────────────────────────┘ │
│ ┌ Thông tin công việc ────────────────────────────────────┐ │
│ │ Địa điểm        Phòng ban       Cấp trên       Loại NV   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌ Vai trò và phạm vi ─────────────────────────────────────┐ │
│ │ Vai trò · Phạm vi/location · Hiệu lực                   │ │
│ │ ...                                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Trạng thái trống và lỗi

```text
┌ Vai trò và phạm vi ────────────────────────────────────────┐
│ [Shield icon] Bạn chưa được gán vai trò                    │
│ Liên hệ Quản trị hệ thống. Khi chưa có vai trò, bạn chưa   │
│ thể xem dữ liệu của location nào.                          │
└────────────────────────────────────────────────────────────┘

┌ Không tải được hồ sơ ──────────────────────────────────────┐
│ Chưa thể tải thông tin của bạn.              [Thử lại]     │
└────────────────────────────────────────────────────────────┘
```

## Responsive

- Từ `lg`: nhận diện và ngôn ngữ đặt hai cột; thẻ vai trò chiếm toàn hàng.
- Mobile: tất cả xếp một cột; các cặp nhãn/giá trị không ép ngang; nút lưu rộng toàn hàng và vùng chạm tối thiểu 44px.
- Nội dung dài được xuống dòng, mã nhân viên/email không đẩy tràn card.

## Accessibility

- Heading theo thứ bậc; các nhóm có tiêu đề rõ.
- Radio/select ngôn ngữ có label thật; thông báo lưu dùng live region/toast.
- Nút đang lưu có `aria-busy`, disabled và cursor đúng trạng thái.
- Vai trò không chỉ phân biệt bằng màu; luôn có tên và phạm vi bằng chữ.
- Focus ring dùng token hệ thống; hỗ trợ bàn phím và reduced motion.

