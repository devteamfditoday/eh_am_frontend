# UC-AST-01 — DESIGN-README (tạo hồ sơ tài sản)

> Màn hình đầu tiên của M03. Token/nền kế thừa hệ thiết kế hiện có (shadcn/Tailwind, `StatusBadge`,
> `SelectDropdown`, `DateField`, `Dialog`, `EmptyState`). UC-AST-07 (danh sách đầy đủ) và UC-AST-08
> (chi tiết) làm sau; ở UC này chỉ dựng **điểm vào + biểu mẫu tạo + xác nhận kết quả**.

## 1. Trang Tài sản (điểm vào)

```
┌───────────────────────────────────────────────────────────────┐
│ Tài sản                                        [ + Thêm tài sản ]│
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│        (empty-state)  Chưa có bộ lọc/danh sách ở bước này.      │
│        Danh sách tra cứu đầy đủ sẽ có ở UC-AST-07.              │
│        Bấm "Thêm tài sản" để lập hồ sơ mới.                      │
│                                                                 │
└───────────────────────────────────────────────────────────────┘
```

- Chỉ Quản lý tài sản thấy mục nav này. Nút **Thêm tài sản** mở `AssetFormDialog`.

## 2. Hộp thoại tạo hồ sơ (AssetFormDialog)

```
┌──────────────────────────────────────────────────────────────┐
│ Thêm tài sản                                             [✕]   │
├──────────────────────────────────────────────────────────────┤
│  Mô tả                                                         │
│  Tên tài sản *           [___________________________]         │
│  Loại tài sản *          [▼ chọn loại (lá) ...........]        │
│  Serial                  [__________]  (*) nếu loại bắt buộc    │
│  Ghi chú                 [textarea .......................]    │
│                                                                │
│  Thông tin mua (không bắt buộc)                                │
│  Ngày mua [📅____]   Nhà cung cấp [▼...]   Số HĐ/PO [_____]     │
│                                                                │
│  Vị trí & trách nhiệm                                          │
│  Địa điểm ban đầu *      [▼ chọn địa điểm ...........]         │
│  Người chịu trách nhiệm *[▼ chọn người ...............]        │
│  Trạng thái ban đầu *    ( ) Lưu kho   ( ) Đang sử dụng         │
│                                                                │
│  [! lỗi cạnh trường sai / khối lỗi chung khi submit]           │
├──────────────────────────────────────────────────────────────┤
│                                   [ Huỷ ]   [ Lưu hồ sơ ]       │
└──────────────────────────────────────────────────────────────┘
```

- **Serial**: nhãn có dấu `*` và bắt buộc **khi loại được chọn có `serialRequired = true`** (đọc từ
  create-options); đổi loại → cập nhật ràng buộc ngay (EX.1).
- **Loại tài sản**: chỉ loại **lá** (có `assetKind` TSCĐ/CCDC); hiển thị `tên — nhóm/kind`.
- **Người chịu trách nhiệm**: danh sách người đang hoạt động; server kiểm BR-AST-09 (phải có vai trò
  trên địa điểm) → nếu sai trả `RESPONSIBLE_NOT_ON_LOCATION`, hiện lỗi cạnh trường này (EX.3).
- **Nguyên giá / ngày dùng / thời gian KH**: KHÔNG có trên biểu mẫu (để Kế toán tài sản nhập ở UC-AST-04).
- `Idempotency-Key` sinh một lần cho mỗi lần mở hộp thoại; bấm Lưu hai lần không tạo hai hồ sơ (EX.6b).

## 3. Sau khi lưu (xác nhận)

- Thành công → toast "Đã tạo hồ sơ **{assetCode}**", đóng hộp thoại. (Chi tiết + mã QR in nhãn xem ở
  UC-AST-08/M04.) Trả về `assetCode` + `qrToken` để bước sau dựng QR.
- Lỗi field (serial bắt buộc, người chịu trách nhiệm) → hiện cạnh đúng trường; lỗi chung (trùng serial
  DUPLICATE_RECORD, REQUEST_TIMEOUT) → khối cảnh báo `role=alert`, giữ nguyên dữ liệu đã nhập.

## 4. Trạng thái & token

| Trạng thái | Xử lý |
| --- | --- |
| Đang tải options | skeleton trong hộp thoại |
| Đang gửi | nút Lưu có spinner, `aria-busy`, khoá nút |
| Lỗi field | text đỏ cạnh trường (serial/responsible) |
| Lỗi chung | khối `role=alert` nền đỏ nhạt |
| Rỗng (trang) | `EmptyState` hướng dẫn bấm Thêm |

| Nhãn trạng thái vòng đời | Tone | | Tình trạng vật lý | Tone |
| --- | --- | --- | --- | --- |
| Lưu kho (IN_STORAGE) | neutral | | Tốt (GOOD) | success |
| Đang sử dụng (IN_USE) | success | | | |

## 5. A11y / responsive

- Hộp thoại `Dialog` (focus trap, Esc), mỗi trường có `<Label htmlFor>`; dấu `*` kèm `aria` cho trường bắt buộc.
- Mobile: hộp thoại cuộn dọc (`max-h-[90vh] overflow-y-auto`), các select full-width, nút chạm ≥44px.
- `SelectDropdown` dùng trong `FormField` (bọc `FormControl`); bộ lọc/standalone dùng Select thô — ở đây đều nằm trong form nên dùng `SelectDropdown`.
