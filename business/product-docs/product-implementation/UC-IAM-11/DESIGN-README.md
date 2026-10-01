# UC-IAM-11 — DESIGN-README (thu hồi vai trò)

> Chỉ mô tả phần THÊM vào màn hình Quyền truy cập (UC-IAM-10). Token, màu, spacing kế thừa
> `UC-IAM-10/DESIGN-README.md`.

## 1. Bảng vai trò — thêm cột "Thao tác"

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Quyền truy cập                                                   [ + Thêm vai trò ]     │
├───────────────┬────────────────┬──────────────────┬────────────┬───────────┬──────────┤
│ Vai trò       │ Phạm vi        │ Hiệu lực         │ Trạng thái │ Lý do     │ Thao tác │
├───────────────┼────────────────┼──────────────────┼────────────┼───────────┼──────────┤
│ Quản lý điểm  │ Cửa hàng Q1    │ 01/10/2026 –     │ ●Đang hiệu │ Nhận việc │[Thu hồi] │
│               │                │ (không hạn)      │  lực       │           │          │
│ NV điểm       │ Kho HCM        │ 10/10 – (mở)     │ ●Sắp hiệu  │ Tạm thời  │[Thu hồi] │
│ Kế toán TS    │ Toàn hệ thống  │ 01/09 – 30/09    │ ○Hết hiệu  │ Hết hạn   │    —     │
│ Kiểm toán     │ Toàn hệ thống  │ 01/08 – 15/08    │ ⊘Đã thu hồi│ Chuyển bp │    —     │
└───────────────┴────────────────┴──────────────────┴────────────┴───────────┴──────────┘
```

- Nút **[Thu hồi]** (`outline`, `size=sm`, căn phải) chỉ ở dòng **Đang hiệu lực**/**Sắp hiệu lực**.
- Dòng **Hết hiệu lực**/**Đã thu hồi**: ô thao tác hiện `—` (không hành động).
- Dòng vai trò SYSTEM_ADMIN (nếu có): không hiện nút (EX.3).

## 2. Hộp thoại xác nhận thu hồi

```
┌─────────────────────────────────────────────────────────────┐
│ Thu hồi vai trò                                          [✕]  │
├─────────────────────────────────────────────────────────────┤
│ Thu hồi "Quản lý điểm" ở phạm vi "Cửa hàng Q1" của            │
│ Nguyễn Văn An. Vai trò sẽ mất hiệu lực từ thao tác kế tiếp;   │
│ lịch sử vẫn được giữ lại.                                     │
│                                                               │
│ Lý do thu hồi *                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Chuyển sang cửa hàng khác                              │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ [! HISTORY_IMMUTABLE: dòng đã được thu hồi …]  (khi lỗi)      │
├─────────────────────────────────────────────────────────────┤
│                              [ Huỷ ]   [ Xác nhận thu hồi ]   │
└─────────────────────────────────────────────────────────────┘
```

- Tiêu đề + `DialogDescription` nêu rõ vai trò/phạm vi/nhân viên để không bấm nhầm dòng.
- Ô **Lý do** bắt buộc (`Textarea`, 2 dòng, ≤500 ký tự). Trống/<2 ký tự → báo tại chỗ trước khi gửi.
- Nút **Xác nhận thu hồi** `variant=destructive`, có spinner + `aria-busy` khi gửi.
- Khối lỗi `role=alert` nền đỏ nhạt hiện thông báo server; EX.1 còn refetch bảng ngầm.

## 3. Trạng thái & token

| Nhãn trạng thái | Tone `StatusBadge` | dot |
| --- | --- | --- |
| Đang hiệu lực | success | ● |
| Sắp hiệu lực | info | ● |
| Hết hiệu lực | neutral | ○ |
| Đã thu hồi | danger | ⊘ |

## 4. Responsive & a11y

- Mobile: bảng cuộn ngang (`overflow-x-auto`, `min-w`), cột Thao tác luôn thấy khi cuộn tới.
- Hộp thoại `sm:max-w-lg`, focus trap, Esc để huỷ; nút tối thiểu 44px chạm.
- Nút Thu hồi có nhãn chữ (không chỉ icon) để trình đọc màn hình đọc rõ hành động.
