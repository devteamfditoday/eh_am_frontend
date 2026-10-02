# UC-AST-10 — DESIGN-README

> Hướng thiết kế: trang hàng đợi nghiệp vụ, đọc nhanh, quyết định tại chỗ. Bảng thưa, hành động rõ ở cuối
> dòng; dialog xác nhận gọn. Kế thừa token Every Half; không GSAP. Vẽ theo bản đã dựng (as-built) GĐ1.
>
> GĐ1 thay Hộp việc (HO-24, chưa có) bằng trang hàng đợi này — ghi rõ ở README để khớp UC [TBD-5].

## 1. Wireframe trang hàng đợi — desktop

```text
Header ……………………………………………………………  ThemeSwitch  Profile

Duyệt huỷ hồ sơ
Các đề nghị huỷ hồ sơ tạo sai đang chờ duyệt.

┌──────────┬────────────────┬───────────┬──────────────┬─────────────┬───────────────────┐
│ Mã TS    │ Tên            │ Địa điểm  │ Người đề nghị│ Lý do       │         Thao tác  │
├──────────┼────────────────┼───────────┼──────────────┼─────────────┼───────────────────┤
│ TS000004 │ Máy pha cà phê │ Kho Q1    │ Nguyễn V. A  │ Trùng hồ sơ │ [Từ chối][Duyệt]  │
│ TS000011 │ Máy xay        │ Cửa hàng  │ Trần B       │ Nhập sai…   │ [Từ chối][Duyệt]  │
└──────────┴────────────────┴───────────┴──────────────┴─────────────┴───────────────────┘
(hẹp hơn 880px thì cuộn ngang; ô Lý do truncate, giữ nguyên một dòng)
```

## 2. Wireframe dialog quyết định

```text
DUYỆT                                     TỪ CHỐI
┌───────────────────────────────┐         ┌───────────────────────────────┐
│ Duyệt huỷ hồ sơ               │         │ Từ chối đề nghị huỷ           │
│ Đề nghị huỷ hồ sơ TS000004.   │         │ Đề nghị huỷ hồ sơ TS000004.   │
│ ┌───────────────────────────┐ │         │ ┌───────────────────────────┐ │
│ │ Người đề nghị: Nguyễn V. A │ │         │ │ Người đề nghị: Nguyễn V. A │ │
│ │ Lý do: Trùng hồ sơ        │ │         │ │ Lý do: Trùng hồ sơ        │ │
│ └───────────────────────────┘ │         │ └───────────────────────────┘ │
│                               │         │ Lý do từ chối *               │
│ (vùng lỗi tổng nếu có)        │         │ [ Chọn lý do            ▾ ]   │
│                               │         │ Ghi chú lý do (*)             │
│                               │         │ [                         ]   │
│      [ Huỷ ]  [Xác nhận huỷ]  │         │      [ Huỷ ]  [Xác nhận TC]   │
└───────────────────────────────┘         └───────────────────────────────┘
```

## 3. Trạng thái màn hình

| Trạng thái | Trình bày |
| --- | --- |
| Đang tải hàng đợi | 5 skeleton dòng, `aria-busy=true` |
| Lỗi tải | EmptyState (icon duyệt) + nút Thử lại |
| Rỗng | EmptyState "Không có đề nghị nào chờ duyệt" + gợi ý |
| Có dữ liệu | bảng; mỗi dòng nút Từ chối (outline) + Duyệt huỷ (tông phá huỷ) |
| Dialog Từ chối tải lý do | skeleton khối trong dialog |
| Đang gửi quyết định | nút `aria-busy`, spinner, khoá |
| EX.1 tự duyệt | lỗi tổng "Cần một Quản lý tài sản khác người đề nghị duyệt." |
| EX.3 đã xử lý / version lệch | lỗi tổng; đóng rồi tải lại hàng đợi thấy đề nghị đã rời |

## 4. Token, tương tác và a11y

- Bảng dùng `@/components/ui/table`; `CodeText` cho mã; cột Lý do `max-w-[260px] truncate`.
- Hành động cuối dòng, gom `justify-end gap-2`; nút Duyệt tông phá huỷ, Từ chối tông outline.
- Dialog `sm:max-w-xl`, `grid gap-5 items-start`; `SelectDropdown` trong `<FormField>`; Textarea `maxLength=500`.
- `aria-busy` mọi nút pending; `TableCaption` `sr-only`; màu luôn kèm chữ; tôn trọng `prefers-reduced-motion`.
