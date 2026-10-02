# UC-AST-09 — DESIGN-README

> Hướng thiết kế: thao tác nhạy cảm (huỷ hồ sơ) nhưng là bước ĐỀ NGHỊ, chưa phá dữ liệu. Dialog gọn,
> một cột, nhấn mạnh tính "cần người khác duyệt". Kế thừa token Every Half; không GSAP cho màn dữ liệu.
> Tài liệu vẽ theo bản đã dựng (as-built) cho GĐ1.

## 1. Điểm vào (trang Chi tiết tài sản)

```text
Máy pha cà phê Nuova Simonelli        [● Đang sử dụng] [Tốt]
TS000004                              [ Đề nghị huỷ hồ sơ ]  ← chỉ ASSET_MANAGER/ACCOUNTANT, !readOnly
```

## 2. Wireframe dialog — desktop (sm:max-w-xl)

```text
┌─────────────────────────────────────────────────────────┐
│ Đề nghị huỷ hồ sơ tạo sai                                │
│ Gửi đề nghị huỷ hồ sơ TS000004. Một Quản lý tài sản      │
│ khác sẽ duyệt; hồ sơ không bị xoá.                       │
│                                                         │
│ Lý do *                                                 │
│ [ Chọn lý do                                   ▾ ]      │
│                                                         │
│ Ghi chú lý do  (*) ← chỉ bắt buộc khi lý do là "Khác"   │
│ [                                               ]       │
│ [                                               ]       │
│                                                         │
│ (⚠ vùng lỗi tổng: "Hồ sơ đã có đề nghị chờ duyệt" …)    │
│                                                         │
│                         [ Huỷ ]   [ Gửi đề nghị ]       │
└─────────────────────────────────────────────────────────┘
```

## 3. Wireframe dialog — mobile

```text
Đề nghị huỷ hồ sơ tạo sai
Gửi đề nghị huỷ hồ sơ TS000004…

Lý do *
[ Chọn lý do            ▾ ]
Ghi chú lý do (*)
[                        ]

[ Gửi đề nghị ]
[ Huỷ         ]
```

## 4. Trạng thái màn hình

| Trạng thái | Trình bày |
| --- | --- |
| Đang tải danh mục lý do | skeleton tiêu đề + khối, `aria-busy=true` |
| Lỗi tải danh mục | câu lỗi đỏ + nút Đóng, không hiện form |
| Chọn lý do "Khác" | hiện `*` ở Ghi chú; để trống → lỗi field (EX.2) |
| Đang gửi | nút "Gửi đề nghị" `aria-busy`, spinner, khoá nút |
| Lỗi nghiệp vụ | REASON_INVALID → lỗi tại trường lý do; còn lại → vùng lỗi tổng đỏ |
| Thành công | toast "Đã gửi đề nghị huỷ, chờ duyệt.", đóng dialog |

## 5. Token, tương tác và a11y

- Nút chính `variant='destructive'` (hành vi phá huỷ), `size='lg'`; nút Huỷ `variant='outline'`.
- `SelectDropdown` trong `<FormField>`; Textarea `rows=3`, `maxLength=500`.
- Lưới `grid gap-5 items-start` để `FormMessage` không đẩy lệch hàng; vùng lỗi tổng nền `destructive/10`.
- `aria-busy` khi pending; con trỏ theo trạng thái lấy từ `Button` chung; màu không phải tín hiệu duy nhất
  (luôn kèm chữ); tôn trọng `prefers-reduced-motion`.
