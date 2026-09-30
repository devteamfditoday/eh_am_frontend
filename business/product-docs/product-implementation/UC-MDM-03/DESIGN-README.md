# DESIGN — UC-MDM-03: Màn Danh mục cost center

> Chốt bố cục trước khi code. Dùng chung token + common component với [UC-MDM-01](../UC-MDM-01/DESIGN-README.md); cost center đơn giản hơn (chỉ mã + tên + trạng thái). Skill: `frontend-design` + `ui-ux-pro-max` + `taste-skill`. Không dùng animation cho màn dữ liệu.
>
> Kế hoạch kỹ thuật: [README.md](./README.md).

## 1. Wireframe — trang danh sách (desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Danh mục cost center                         [ + Thêm cost center ]│  ← PageHeader
│  Mã chi phí khớp danh mục trên FAST để GĐ2 đối chiếu.            │
├────────────────────────────────────────────────────────────────┤
│  [ 🔍 Tìm mã hoặc tên… ]        [ Trạng thái ▾ ]      [ ⚙ Cột ▾ ]│  ← toolbar
├──────────────────┬─────────────────────────────┬────────────────┤
│ MÃ               │ TÊN                         │ TRẠNG THÁI     │
├──────────────────┼─────────────────────────────┼────────────────┤
│ CC-STORE-01      │ Chi phí cửa hàng Quận 1     │ ● Đang HĐ  │ ⋯ │
│ CC-WH-01         │ Chi phí kho trung tâm       │ ● Đang HĐ  │ ⋯ │
│ CC-ROAST-01      │ Chi phí xưởng rang          │ ● Đang HĐ  │ ⋯ │
├──────────────────┴─────────────────────────────┴────────────────┤
│  3 / 3 dòng                              [◀]  Trang 1/1  [▶]      │
└────────────────────────────────────────────────────────────────┘
```

- Cột MÃ: `CodeText` (SUSE Mono). Cột thao tác cuối dòng: **Sửa** (đổi tên) + **Ngừng** (nút ghost, chữ + icon `text-destructive`, icon `Ban`), cả hai disabled khi dòng đã INACTIVE. Luồng Ngừng (AC.2) đã dựng: kiểm location đang dùng ở backend; kiểm tài sản hoãn tới M03.

## 2. Wireframe — dialog Thêm / Sửa

```
        ┌──────────────────────────────────────┐
        │  Thêm cost center               [✕]  │  ← edit: "Sửa cost center — CC-STORE-01"
        │  Nhập mã theo danh mục FAST.          │
        ├──────────────────────────────────────┤
        │  Mã cost center *   ┌───────────────┐ │  ← edit: disabled + hint "Không đổi được"
        │                     │ CC-STORE-01   │ │
        │                     └───────────────┘ │
        │  Tên *              ┌───────────────┐ │
        │                     │ Chi phí CH Q1 │ │
        │                     └───────────────┘ │
        ├──────────────────────────────────────┤
        │                    [ Huỷ ]   [ Lưu ]   │
        └──────────────────────────────────────┘
```

- `react-hook-form` + Zod (`cost-center-schema.ts`). Edit: **Mã** disabled (BR-MDM-17).
- Trùng mã (EX.2) → lỗi gắn field Mã: "Mã đã dùng (kể cả cost center đã ngừng)".
- Xung đột phiên (EX.4) → alert trong dialog + nút Tải lại.

## 2b. Wireframe — dialog Ngừng hoạt động (AC.2)

```
        ┌──────────────────────────────────────┐
        │  Ngừng cost center CC-STORE-01   [✕] │
        │  Mục đã ngừng sẽ không còn ở các     │
        │  danh sách chọn, lịch sử vẫn giữ.    │
        ├──────────────────────────────────────┤
        │  Lý do ngừng *      ┌───────────────▾┐│  ← select: lý do nhóm CATALOG_DEACTIVATE
        │                     │ Chọn lý do…    ││    (chỉ lý do Đang HĐ)
        │                     └───────────────┘│
        │  Ghi chú thêm *     ┌───────────────┐│  ← chỉ hiện khi lý do = "Khác" (is_freetext)
        │                     │               ││    bắt buộc khi hiện; ≤ 500 ký tự
        │                     └───────────────┘│
        ├──────────────────────────────────────┤
        │                 [ Huỷ ]  [ Xác nhận ngừng ]│  ← nút xác nhận biến thể destructive
        └──────────────────────────────────────┘
```

- Select lý do: `SelectDropdown` nạp từ `reasonCodesQueryOptions({ reasonGroup:'CATALOG_DEACTIVATE', status:'ACTIVE' })`; nhãn map i18n theo `label` người dùng nhập (CodeText không dùng ở đây vì là tên lý do, không phải mã).
- Ghi chú (`note`) chỉ hiện + bắt buộc khi lý do chọn là mục "Khác" (`isFreetext`) — khớp RPC `REASON_NOTE_REQUIRED`.
- **Còn dùng (EX.3 `CATALOG_ITEM_IN_USE` 409):** alert đỏ trong dialog dùng message backend ("Mục này vẫn đang được dùng…"), không đóng dialog.
- **Xung đột phiên (EX.4):** alert + nút Tải lại (như dialog Sửa).
- Dùng chung component `DeactivateCatalogDialog` với UC-MDM-07.

## 3. Trạng thái & responsive

- Tải: skeleton bảng. Rỗng: `EmptyState` "Chưa có cost center" + nút Thêm. Lỗi tải: alert + Thử lại. Lưu xong: toast + đóng dialog.
- < 640px: dialog → `Sheet` từ dưới; bảng cuộn ngang. Nút ≥ 44px. Tôn trọng `prefers-reduced-motion`.

## 4. A11y

Label liên kết input; lỗi qua `aria-describedby`; dialog bẫy focus + Esc; `StatusBadge` có chấm + chữ; `<caption>` ẩn "Danh sách cost center".

## 5. Skill dùng

`frontend-design` (bố cục màn dữ liệu, thang chữ) + `ui-ux-pro-max` (bảng + form + trạng thái) + `taste-skill`. Không dùng `gsap-skills`/`hyperframes`/`impeccable`.
