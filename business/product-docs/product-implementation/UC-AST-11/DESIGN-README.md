# UC-AST-11 — DESIGN-README (đưa vào / ngừng sử dụng tài sản)

> Thêm một thao tác đổi trạng thái vòng đời trên trang **Chi tiết tài sản** (`/assets/$id`) + một
> dialog xác nhận kèm lý do. Kế thừa nguyên bộ token/component Every Half và đúng khuôn
> `AssetResponsibilityDialog` (UC-AST-05) để nhất quán; không tạo nhận diện mới.

## 1. Nút thao tác trên header chi tiết

```
┌──────────────────────────────────────────────────────────────────────┐
│ TS000003  Máy pha cà phê                                               │
│ Hồ sơ đang hoạt động                                                   │
│  [Sửa thông tin]* [Đổi người chịu trách nhiệm]  [Đưa vào sử dụng]‡     │
│  ●Lưu kho   ●Tốt                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

- `‡` Nút đổi trạng thái:
  - hiện khi `hasAnyRole(user,[ASSET_MANAGER, LOCATION_MANAGER])` **và** `!readOnly` **và**
    `lifecycleStatus ∈ {IN_STORAGE, IN_USE}`.
  - nhãn theo trạng thái hiện tại: `IN_STORAGE → "Đưa vào sử dụng"`, `IN_USE → "Ngừng sử dụng"`.
  - trạng thái khác (Đang sửa, Chờ điều chuyển… hoặc kết thúc) → **không hiện nút** (EX.1/EX.2).
- `*` giữ nguyên gating cũ (Sửa thông tin chỉ ASSET_MANAGER).

## 2. Dialog xác nhận

```
┌──────────────── Đưa vào sử dụng ─────────────────┐
│ Tài sản TS000003 · Máy pha cà phê                 │
│                                                   │
│  Trạng thái     [●Lưu kho] -> [●Đang sử dụng]     │
│                                                   │
│  Lý do *        [v Chọn lý do.................]    │
│  Ghi chú(*)     [textarea 3 dòng, <=500.........] │
│                                                   │
│  (!) Trạng thái đã đổi — [Tải lại hồ sơ]          │ (khi 409)
│                [Hủy]            [Xác nhận]         │
└───────────────────────────────────────────────────┘
```

- Khối "Trạng thái" hiển thị chip hiện tại → chip đích (StatusBadge, tone theo vòng đời) — người dùng
  thấy rõ chiều đổi, không cần chọn trạng thái (đích suy ra tự động).
- **Lý do** bắt buộc (SelectDropdown, nhóm `USE_STATUS_CHANGE`); mục 'Khác' (freetext) → **Ghi chú**
  thành bắt buộc (RequiredMark xuất hiện) — EX.3.
- Trạng thái dialog: tải (Skeleton `aria-busy`), lỗi options (alert + Hủy), **xung đột phiên 409**
  (thông báo + "Tải lại hồ sơ" → invalidate detail), lỗi chung (alert đỏ).
- `key={asset.id}-${profileVersion}` để reset form khi version đổi; `Idempotency-Key` tạo 1 lần/dialog.

## 3. A11y / responsive

- Dialog `max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl`; nút >=44px; FormLabel + RequiredMark;
  alert có `role='alert'`; nút submit `aria-busy` khi đang gửi.
- Mobile: nút thao tác xuống hàng (`flex-wrap`); dialog full-width có lề 16px.
