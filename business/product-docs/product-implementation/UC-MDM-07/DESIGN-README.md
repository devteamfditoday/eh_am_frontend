# DESIGN — UC-MDM-07: Màn Danh mục lý do

> Dùng chung token + common component với các danh mục M02 khác; thêm chiều **nhóm**. Skill: `frontend-design` + `ui-ux-pro-max` + `taste-skill`. Áp đủ chuẩn UI bắt buộc ở `eh_am_frontend/CLAUDE.md`.
>
> Kế hoạch: [README.md](./README.md).

## 1. Wireframe — trang danh sách (desktop)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Danh mục lý do                                          [ + Thêm lý do ]│  ← PageHeader (nút lg)
│  Lý do chuẩn cho các thao tác cần ghi "vì sao".                         │
├──────────────────────────────────────────────────────────────────────┤
│  [ 🔍 Tìm… ]     [ Nhóm ▾ ]   [ Trạng thái ▾ ]              [ ⚙ Cột ▾ ]│  ← toolbar (lọc theo nhóm)
├────────────────────┬──────────┬──────────────────────┬────────────────┤
│ NHÓM               │ MÃ       │ TÊN LÝ DO            │ TRẠNG THÁI     │
├────────────────────┼──────────┼──────────────────────┼────────────────┤
│ Thanh lý / báo giảm│ LOST     │ Mất mát             │ ● Đang HĐ  │ ⋯ │
│ Thanh lý / báo giảm│ OTHER    │ 🔒 Khác             │ ● Đang HĐ  │ (khoá) │
│ Điều chuyển        │ OTHER    │ 🔒 Khác             │ ● Đang HĐ  │ (khoá) │
└────────────────────┴──────────┴──────────────────────┴────────────────┘
```

- Cột NHÓM hiển thị nhãn tiếng Việt (map i18n). Mục "Khác" (`isFreetext`) có biểu tượng khoá, nút Sửa + Ngừng disabled (EX.3). Dòng thường Đang HĐ có thêm nút **Ngừng** (nút ghost chữ `text-destructive`, icon `Ban`) cạnh Sửa.

## 2. Wireframe — dialog Thêm / Sửa

```
        ┌──────────────────────────────────────┐
        │  Thêm lý do                     [✕]  │  ← edit: "Sửa lý do — LOST"
        │  Chọn nhóm, nhập mã và tên lý do.     │
        ├──────────────────────────────────────┤
        │  Nhóm thao tác *  [ Thanh lý...   ▾ ] │  ← edit: disabled (nhóm không đổi)
        │  Mã lý do *       [ LOST           ]  │  ← edit: disabled; gợi ý mã chip
        │  Tên lý do *      [ Mất mát        ]  │
        ├──────────────────────────────────────┤
        │                 [ Huỷ ]   [ Lưu ]      │  ← nút lg, Lưu min-w-32, aria-busy
        └──────────────────────────────────────┘
```

- Trường bắt buộc `*` đỏ. Trùng (nhóm, mã) → lỗi field mã. Mục "Khác" → SYSTEM_REASON_PROTECTED (câu riêng).

## 2b. Wireframe — dialog Ngừng lý do (AC.2)

```
        ┌──────────────────────────────────────┐
        │  Ngừng lý do LOST               [✕]  │
        │  Lý do đã ngừng không còn ở danh     │
        │  sách chọn; nhật ký cũ vẫn giữ.      │
        ├──────────────────────────────────────┤
        │  Lý do ngừng *      [ Chọn lý do…  ▾ ]│  ← lý do nhóm CATALOG_DEACTIVATE (Đang HĐ),
        │                                      │    loại chính lý do đang ngừng (EX.1)
        │  Ghi chú thêm *     [              ]  │  ← chỉ khi lý do = "Khác"; ≤ 500 ký tự
        ├──────────────────────────────────────┤
        │                 [ Huỷ ]  [ Xác nhận ngừng ]│
        └──────────────────────────────────────┘
```

- Dùng chung component `DeactivateCatalogDialog` với UC-MDM-03; truyền `excludeReasonId = id` để loại chính lý do đang ngừng khỏi danh sách chọn (EX.1).
- Chặn mục "Khác" ở tầng nút (disabled) + backend `SYSTEM_REASON_PROTECTED` (EX.3). Xung đột phiên → alert + Tải lại (EX.4).

## 3. Trạng thái, responsive, a11y

Skeleton / EmptyState / lỗi + Thử lại. < 640px: dialog → sheet; bảng cuộn ngang. Con trỏ theo trạng thái; disabled select nền `bg-muted`; `StatusBadge` có chấm + chữ; icon khoá `aria-hidden`.

## 4. Skill dùng

`frontend-design` + `ui-ux-pro-max` + `taste-skill`.
