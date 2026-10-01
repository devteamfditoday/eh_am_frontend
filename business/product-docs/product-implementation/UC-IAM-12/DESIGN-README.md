# UC-IAM-12 — DESIGN-README (khóa / mở khóa tài khoản)

> Kế thừa typography, màu, spacing và component của trang Quyền truy cập. Đây là hành động quản trị
> nhạy cảm nên ưu tiên rõ ràng, bình tĩnh và có thể hoàn tác; không dùng hiệu ứng trang trí.

## 1. Header hồ sơ

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Nguyễn Văn An   EH0123                         [● Đang hoạt động] [Khóa TK] │
│ Quyền truy cập và trạng thái tài khoản                                     │
└─────────────────────────────────────────────────────────────────────────────┘

SUSPENDED:
│ Nguyễn Văn An   EH0123                              [● Tạm khóa] [Mở khóa] │
```

- Nút khóa: `variant=outline`, icon khóa, không tô đỏ toàn khối vì hành động có bước xác nhận.
- Nút mở khóa: `variant=default`, icon mở khóa.
- Mobile (`< sm`): tên + mã ở hàng một; trạng thái và nút ở hàng hai, nút cao tối thiểu 44px.
- Hồ sơ chính mình hoặc trạng thái không hỗ trợ: chỉ còn badge, không để nút disabled gây mơ hồ.

## 2. Dialog khóa

```text
┌──────────────────────────────────────────────────────────────┐
│ Khóa tài khoản                                           [×] │
│ Nguyễn Văn An sẽ bị chặn từ yêu cầu kế tiếp. Các vai trò    │
│ và hồ sơ vẫn được giữ để có thể mở lại sau.                  │
│                                                              │
│ Lý do khóa *                                                 │
│ [ Chọn lý do                                             ▾ ] │
│                                                              │
│ Ghi chú *                         (chỉ hiện nếu lý do “Khác”) │
│ [ Mô tả ngắn sự cố hoặc thời gian nghỉ dài...              ] │
│                                                              │
│ [! Thông báo lỗi dễ hiểu, hướng dẫn làm mới/thử lại]         │
│                                    [Hủy] [Xác nhận khóa]      │
└──────────────────────────────────────────────────────────────┘
```

- Description nói đúng hậu quả: request bị chặn, phiên được thu hồi, vai trò không mất.
- Nút xác nhận `destructive`; submit chỉ bật khi lý do và ghi chú cần thiết hợp lệ.

## 3. Dialog mở khóa

```text
┌──────────────────────────────────────────────────────────────┐
│ Mở khóa tài khoản                                        [×] │
│ Nguyễn Văn An có thể đăng nhập lại sau khi mở khóa. Người    │
│ dùng cần tạo một phiên đăng nhập mới.                         │
│                                                              │
│ Lý do mở khóa *                                              │
│ [ Chọn lý do                                             ▾ ] │
│                                                              │
│                                    [Hủy] [Xác nhận mở khóa]   │
└──────────────────────────────────────────────────────────────┘
```

- Nút xác nhận dùng màu primary vì đây là hành động khôi phục.
- Cấu trúc field giữ nguyên giữa hai dialog để giảm tải nhận thức.

## 4. Trạng thái phản hồi

| Trạng thái | Hiển thị |
| --- | --- |
| Đang gửi | Spinner trong nút, `aria-busy=true`, khóa close ngoài ý muốn |
| Lỗi validation | Lỗi ngay dưới field, focus field đầu tiên lỗi |
| Xung đột | Alert trong dialog + refetch hồ sơ |
| Khóa thành công, thu hồi phiên lỗi | Toast cảnh báo; badge vẫn chuyển **Tạm khóa** |
| Thành công đầy đủ | Toast ngắn, đóng dialog, badge và hành động đổi tương ứng |

