# Wireframe — UC-IAM-06: Kích hoạt tài khoản

## Hướng thiết kế

Đây là lần đầu nhân viên chạm vào EH-AM. Màn hình cần tạo cảm giác an toàn, ngắn và rõ việc phải làm: kiểm đúng người, đặt mật khẩu, rồi đăng nhập. Giữ ngôn ngữ tự nhiên; không đưa thuật ngữ “token”, “Auth” hay trạng thái kỹ thuật ra giao diện.

## Desktop (≥ 1024 px)

```text
┌────────────────────────────────┬──────────────────────────────────────┐
│ Every Half                     │                                      │
│ ┌────────────────────────────┐ │       Brand panel hiện có            │
│ │ Kích hoạt tài khoản        │ │       (trang trí, aria-hidden)       │
│ │ Đặt mật khẩu để bắt đầu.   │ │                                      │
│ │                            │ │                                      │
│ │ Nguyễn Văn An              │ │                                      │
│ │ an.nguyen@everyhalf.vn     │ │                                      │
│ │                            │ │                                      │
│ │ Mật khẩu mới *             │ │                                      │
│ │ [••••••••••••••      👁]   │ │                                      │
│ │ 8–72 ký tự, có chữ...      │ │                                      │
│ │ Nhập lại mật khẩu *        │ │                                      │
│ │ [••••••••••••••      👁]   │ │                                      │
│ │                            │ │                                      │
│ │ [ Kích hoạt tài khoản ]    │ │                                      │
│ └────────────────────────────┘ │                                      │
└────────────────────────────────┴──────────────────────────────────────┘
```

- Card cùng nhịp với đăng nhập/đặt lại mật khẩu, rộng tối đa 384 px.
- Khối nhận diện có nền muted nhẹ, icon người dùng nhỏ; họ tên là thông tin chính, email là dòng phụ có thể xuống dòng.
- Trợ giúp mật khẩu nằm ngay dưới ô đầu, không làm lệch cặp field vì form một cột.

## Mobile (< 768 px)

```text
┌──────────────────────────────┐
│ Every Half                   │
│                              │
│ Kích hoạt tài khoản          │
│ Đặt mật khẩu để bắt đầu.     │
│ ┌──────────────────────────┐ │
│ │ Nguyễn Văn An            │ │
│ │ an.nguyen@everyhalf.vn   │ │
│ └──────────────────────────┘ │
│ Mật khẩu mới *               │
│ [••••••••••••••••      👁]   │
│ Nhập lại mật khẩu *          │
│ [••••••••••••••••      👁]   │
│                              │
│ [ Kích hoạt tài khoản      ] │
└──────────────────────────────┘
```

- Một cột, padding 24 px, nút đầy chiều rộng; không fixed footer để không che bàn phím.
- Email dùng `overflow-wrap:anywhere`; toàn bộ thao tác dùng được ở 320–360 px.

## Trạng thái

```text
Đang kiểm tra: skeleton 2 dòng + 2 field, aria-busy.
Hết hạn:        icon đồng hồ + “Liên kết đã hết hạn” + hướng dẫn liên hệ quản trị.
Đã dùng:        icon kiểm tra + “Tài khoản đã được kích hoạt” + [Đăng nhập].
Không hợp lệ:   icon liên kết đứt + câu chung, không hiện họ tên/email.
Thành công:     icon check + “Tài khoản đã sẵn sàng” + [Đăng nhập].
```

## Accessibility và tương tác

- Heading cấp 1 duy nhất; label thật cho hai ô; nút hiện/ẩn mật khẩu có accessible name.
- Focus form vào mật khẩu mới khi preview xong; khi lỗi focus alert; khi thành công focus heading xác nhận.
- Không dùng màu làm tín hiệu duy nhất. Icon trang trí `aria-hidden`; nội dung trạng thái có chữ rõ nghĩa.
- Touch target ≥44 px, cursor đúng control, contrast theo token design system, tôn trọng reduced motion.
