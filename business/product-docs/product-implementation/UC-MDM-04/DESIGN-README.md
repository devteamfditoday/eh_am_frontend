# DESIGN — UC-MDM-04: Màn Cây loại tài sản

> Chốt bố cục trước khi code. Cây HAI CẤP (nhóm → loại) khác các danh mục phẳng M02 khác. Dùng chung token + common component + `DeactivateCatalogDialog`. Skill: `frontend-design` + `ui-ux-pro-max` + `taste-skill`. Không animation cho màn dữ liệu. Áp đủ chuẩn UI bắt buộc ở `eh_am_frontend/CLAUDE.md`.
>
> Kế hoạch kỹ thuật: [README.md](./README.md). Backend: `eh_am_backend/.../UC-MDM-04/README.md`.

## 1. Wireframe — trang cây (desktop)

```
┌────────────────────────────────────────────────────────────────────────┐
│  Cây loại tài sản                                        [ + Thêm nhóm ] │  ← PageHeader (nút lg)
│  Loại quyết định TSCĐ hay CCDC và có bắt buộc serial hay không.          │
├────────────────────────────────────────────────────────────────────────┤
│  [ 🔍 Tìm mã hoặc tên… ]              [ Trạng thái ▾ ]                    │  ← toolbar
├────────────────────────────────────────────────────────────────────────┤
│  ▸ THIẾT BỊ IT  (IT-EQ)              ● Đang HĐ     [+ Thêm loại][Sửa][Ngừng]│  ← hàng NHÓM (đậm)
│     ├ LAPTOP    Máy tính xách tay    TSCĐ · Serial ● Đang HĐ  [Sửa][Ngừng]│  ← hàng LOẠI (thụt vào)
│     └ MOUSE     Chuột                CCDC          ● Đang HĐ  [Sửa][Ngừng]│
│  ▸ NỘI THẤT     (FURNITURE)          ● Đang HĐ     [+ Thêm loại][Sửa][Ngừng]│
│     └ CHAIR     Ghế văn phòng        CCDC          ● Đang HĐ  [Sửa][Ngừng]│
└────────────────────────────────────────────────────────────────────────┘
```

- **Không dùng bảng phẳng**: render 2 cấp từ danh sách phẳng (`listAssetTypes` trả tất cả, client gom theo `parentId`). Mỗi **nhóm** là một khối tiêu đề (tên đậm + `CodeText` mã + `StatusBadge`), bên dưới là danh sách **loại** thụt lề.
- Cột mã: `CodeText` (SUSE Mono). Cờ hiển thị bằng **badge chữ**: TSCĐ / CCDC (map i18n từ `assetKind`, KHÔNG show `FIXED_ASSET`/`TOOL` thô), thêm chip "Serial" khi `serialRequired`.
- Nút trên hàng nhóm: **+ Thêm loại** (mở dialog loại với `parentId` sẵn), **Sửa**, **Ngừng**. Nút trên hàng loại: **Sửa**, **Ngừng**. Tất cả disabled khi dòng INACTIVE; **Ngừng** là nút ghost chữ `text-destructive` (icon `Ban`).
- Nhóm đã ngừng: hiện mờ, không cho thêm loại.

## 2. Wireframe — dialog Thêm/Sửa NHÓM

```
        ┌──────────────────────────────────────┐
        │  Thêm nhóm loại tài sản         [✕]  │  ← sửa: "Sửa nhóm — IT-EQ"
        ├──────────────────────────────────────┤
        │  Mã nhóm *     [ IT-EQ         ]      │  ← sửa: disabled (BR-MDM-17), chip gợi ý mã
        │  Tên nhóm *    [ Thiết bị IT   ]      │
        ├──────────────────────────────────────┤
        │                 [ Huỷ ]   [ Lưu ]     │
        └──────────────────────────────────────┘
```

## 3. Wireframe — dialog Thêm/Sửa LOẠI

```
        ┌────────────────────────────────────────────┐
        │  Thêm loại vào “Thiết bị IT”          [✕]  │  ← sửa: "Sửa loại — LAPTOP"
        ├────────────────────────────────────────────┤
        │  Mã loại *        [ LAPTOP        ]         │  ← sửa: disabled; chip gợi ý mã
        │  Tên loại *       [ Máy tính...   ]         │
        │  Phân loại *      ( ) TSCĐ   ( ) CCDC       │  ← radio/segmented; bắt buộc
        │  [x] Bắt buộc nhập serial khi lập hồ sơ     │  ← switch/checkbox
        │  Thời gian sử dụng (tháng)  [ 36 ]          │  ← số nguyên dương, không bắt buộc
        │  Mã nhóm FAST     [ FA-IT        ]          │  ← ≤20 ký tự, không bắt buộc
        ├────────────────────────────────────────────┤
        │                    [ Huỷ ]   [ Lưu ]        │
        └────────────────────────────────────────────┘
```

- **Nhóm cha chỉ đọc** khi thêm loại (đã chọn từ nút "+ Thêm loại" của nhóm) và khi sửa (BR-MDM-17). Không có ô chọn nhóm cha rời để tránh nhầm.
- Phân loại (`assetKind`) TSCĐ/CCDC bắt buộc; sửa loại vẫn đổi được ở GĐ này (chặn khi có tài sản là HOÃN tới M03 ở backend).
- Trùng mã (EX.2) → lỗi field mã "Mã đã dùng (kể cả mục đã ngừng)". Xung đột phiên (EX.4) → alert + Tải lại.

## 4. Wireframe — dialog Ngừng (dùng chung)

Dùng `DeactivateCatalogDialog` như UC-MDM-03/07: chọn lý do nhóm CATALOG_DEACTIVATE, ô ghi thêm khi "Khác". Ngừng **nhóm còn loại Đang HĐ** → alert `CATALOG_ITEM_IN_USE` ("Mục này vẫn đang được dùng…"). Ngừng loại: kiểm tài sản là HOÃN (M03).

## 5. Trạng thái, responsive, a11y

- Tải: skeleton. Rỗng: `EmptyState` "Chưa có nhóm loại tài sản" + nút Thêm nhóm. Lỗi: alert + Thử lại.
- < 640px: dialog → `Sheet`; cây cuộn ngang nếu cần; nút ≥ 44px; tôn trọng `prefers-reduced-motion`.
- Cây có `role`/`aria` phù hợp; nhóm là tiêu đề vùng; cờ hiển thị bằng chữ (không chỉ màu); con trỏ theo trạng thái (disabled → not-allowed, loading → wait).

## 6. Skill dùng

`frontend-design` + `ui-ux-pro-max` + `taste-skill`. Không dùng `gsap-skills`/`hyperframes`/`impeccable`.
