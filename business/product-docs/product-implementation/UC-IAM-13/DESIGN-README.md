# UC-IAM-13 — DESIGN-README

```text
┌──────────────────────────────────────────────────────────────┐
│ Cho Nguyễn Văn An nghỉ việc                              [×] │
│ Tài khoản sẽ ngừng, mọi vai trò và phiên sẽ bị đóng.          │
│                                                              │
│  Cấp dưới trực tiếp  3   │ Vai trò mở  2 │ Tài sản  0         │
│  Cấp trên mới * [Chọn nhân viên                         ▾]   │
│  Lý do nghỉ việc * [Chọn lý do                         ▾]   │
│  Ghi chú [...............................................]   │
│                                                              │
│  [!] Không thể mở lại tài khoản Đã ngừng từ màn hình này.     │
│                           [Hủy] [Xác nhận cho nghỉ việc]       │
└──────────────────────────────────────────────────────────────┘
```

- Summary dùng một khối border chia ba cột, mobile xếp dọc; không dùng card trang trí riêng lẻ.
- Nút destructive chỉ bật khi toàn bộ cấp dưới/tài sản đã có người nhận hợp lệ và lý do hợp lệ.
- Thành công hiển thị số cấp dưới/vai trò/tài sản đã xử lý; session warning không đổi kết quả.

