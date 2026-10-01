# UC-AST-07 — DESIGN-README (danh sách tài sản)

> Mở rộng trang `/assets`: thanh tìm + bộ lọc + bảng + phân trang. Token/nền kế thừa (shadcn, Table,
> StatusBadge, DataTablePagination, Select). Xuất Excel (AC.1) chưa vẽ (HOÃN).

## 1. Bố cục trang

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Tài sản                                               [ + Thêm tài sản ]*    │
│ Lập hồ sơ tài sản & CCDC...                                                  │
├───────────────────────────────────────────────────────────────────────────┤
│ [🔎 Tìm theo tên, Asset ID hoặc serial........]   12 tài sản                 │
│ [Loại ▼]* [Trạng thái ▼] [Tình trạng ▼] [Địa điểm ▼]*   [Xoá lọc]            │
├──────────┬───────────────┬────────┬───────────┬──────────────┬────────┬─────┤
│ Asset ID │ Tên (+serial) │ Loại   │ Địa điểm  │ Người ch.nh. │ T.thái │ T.tr│
├──────────┼───────────────┼────────┼───────────┼──────────────┼────────┼─────┤
│ TS000001 │ Máy pha       │ Máy pha│ CH Quận 1 │ Nguyễn Văn A │ ●Đang  │ ●Tốt│
│          │ SN-123        │        │           │ NV001        │  dùng  │     │
│ TS000002 │ Ghế           │ Ghế VP │ Kho HCM   │ Trần Thị B   │ ○Lưu   │ ⚠Cần│
│          │               │        │           │              │  kho   │ sửa │
├──────────┴───────────────┴────────┴───────────┴──────────────┴────────┴─────┤
│ [‹ Trước]   Trang 1/3 · 20/trang ▼              [Sau ›]                       │
└───────────────────────────────────────────────────────────────────────────┘
```

- `*` = chỉ Quản lý tài sản thấy (nút Thêm; bộ lọc Loại/Địa điểm lấy từ create-options). Quản lý điểm
  xem bảng + tìm + lọc Trạng thái/Tình trạng; hai bộ lọc Loại/Địa điểm tự ẩn.
- **Không có cột giá trị/nguyên giá** ở GĐ1 (BR-CMN-06).

## 2. Token trạng thái

| Vòng đời | Tone | | Tình trạng | Tone |
| --- | --- | --- | --- | --- |
| Đang sử dụng | success ● | | Tốt | success ● |
| Lưu kho | neutral ○ | | Cần sửa | warning ⚠ |
| Đang sửa chữa | warning | | Hỏng | danger |
| Chờ thanh lý | info | | | |
| Đã thanh lý / Đã huỷ | danger | | | |

## 3. Trạng thái màn hình

- **Tải:** 6 skeleton rows (`aria-busy`).
- **Lỗi (EX.4):** EmptyState lỗi + Thử lại, giữ từ khoá/lọc.
- **Rỗng chưa lọc:** EmptyState mời "Thêm tài sản" (nút chỉ khi có quyền tạo).
- **Rỗng có lọc (AC.2):** EmptyState "Không có tài sản nào khớp", giữ lọc; đổi từ khoá/lọc để thử lại.
- **Có dữ liệu:** bảng + phân trang (server, manual); `keepPreviousData` tránh nháy.

## 4. Responsive & a11y

- Mobile: bảng cuộn ngang (`min-w-[920px]` + `overflow-x-auto`); ô tìm + select full-width, chạm ≥44px.
- Mỗi select lọc có `<Label>` ẩn-nhãn-nhỏ; nút phân trang có nhãn; `TableCaption` sr-only.
- Tên người chịu trách nhiệm là dữ liệu cá nhân — chỉ hiện trong phạm vi người xem được phép (server lọc).
