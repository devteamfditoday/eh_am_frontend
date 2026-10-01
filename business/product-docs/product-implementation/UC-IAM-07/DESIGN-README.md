# UC-IAM-07 — Wireframe gửi lại lời mời

## Danh sách nhân viên

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Nhân viên                                             + Thêm nhân viên│
│ Tra cứu hồ sơ, nơi làm việc và trạng thái tài khoản.                │
├──────────────────────────────────────────────────────────────────────┤
│ [Tìm kiếm…]  [Địa điểm ▾] [Trạng thái ▾] …                          │
├──────────────┬────────────────────┬───────────────────────────────────┤
│ Nguyễn An    │ an@everyhalf.vn    │ ● Chờ kích hoạt                  │
│ NV0012       │                    │ Lời mời: Hết hạn                  │
│              │                    │ [✉ Gửi lại lời mời]               │
└──────────────┴────────────────────┴───────────────────────────────────┘
```

- Không đổi cấu trúc bảng đã duyệt; action đặt sát trạng thái lời mời để quan hệ rõ ràng.
- Action chữ + icon Lucide, không chỉ dựa vào icon hay hover; vùng bấm tối thiểu 44px trên mobile.
- Không render action cho tài khoản mật khẩu tạm hoặc trạng thái khác `PENDING_ACTIVATION`.

## Dialog xác nhận

```text
┌─────────────────────────────────────────────────────┐
│ Gửi lại lời mời kích hoạt?                          │
│                                                     │
│ Một lời mời mới sẽ được gửi tới                     │
│ an@everyhalf.vn. Lời mời cũ sẽ mất hiệu lực ngay.   │
│                                                     │
│                               [Hủy] [Gửi lời mời]   │
└─────────────────────────────────────────────────────┘
```

- Dialog gọn, một quyết định, không dùng màu nguy hiểm vì đây không phải thao tác xóa dữ liệu.
- Khi chờ: nút xác nhận đổi sang “Đang gửi…”, `aria-busy=true`; Hủy và đóng dialog bị khóa để tránh trạng thái mơ hồ.
- Thành công dùng toast ngắn có thời điểm gửi. Lỗi xung đột/email/timeout nói rõ bước tiếp theo.
- Mobile: footer xếp dọc theo primitive hiện có; nội dung không tràn ngang. Dark mode dùng token semantic sẵn có.
- Chuyển động chỉ dùng transition của dialog hiện hữu và tôn trọng `prefers-reduced-motion`; GSAP không cần cho tác vụ dữ liệu ngắn này.

