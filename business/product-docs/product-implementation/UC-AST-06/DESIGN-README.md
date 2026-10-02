# UC-AST-06 — DESIGN-README (đính kèm chứng từ tài sản)

> Thêm khối **Chứng từ** vào trang Chi tiết tài sản + dialog tải lên. Kế thừa **nguyên hệ thiết kế Every
> Half đã chốt** (Card, StatusBadge tones, Button, Dialog, SelectDropdown, Skeleton, EmptyState, token
> màu/space hiện có) — đây là hướng thị giác đã ghim, nên khối mới phải *hoà* vào, không tạo nhận diện
> mới. Chủ ý tránh các "tell" AI: không eyebrow IN HOA tracked-out, không nhồi card lồng card, badge mã
> hoá **thông tin thật** (loại chứng từ) chứ không trang trí.

## 1. Khối "Chứng từ" trên trang chi tiết (thay empty-state hiện tại)

```
┌─ Chứng từ ─────────────────────────────────── [ + Đính kèm chứng từ ]* ─┐
│                                                                          │
│  > [Hoá đơn]   hoa-don-TS000003.pdf                              [ Xem ] │
│      Nguyễn Văn A · 02/10/2026                                           │
│  --------------------------------------------------------------------    │
│  > [Ảnh]       anh-ban-giao.jpg                                  [ Xem ] │
│      Trần Thị B · 01/10/2026                                             │
└──────────────────────────────────────────────────────────────────────────┘
```

- `*` nút **Đính kèm chứng từ**: chỉ hiện khi `hasAnyRole(user,[ASSET_MANAGER, ASSET_ACCOUNTANT])` **và**
  `!readOnly`. Đặt ở góc phải header card (hành động thuộc về khối, không nổi như CTA trang).
- Mỗi dòng: **badge loại** (tone theo loại) + tên tệp (truncate, `break-all` ở mobile) → hàng phụ nhỏ
  `người tải · ngày` (text-muted; dấu · ngăn 2 dữ kiện thật, không phải trang trí). Nút **Xem** bên phải,
  cấp link signed URL rồi mở tab mới.
- Hoá đơn/PO chỉ hiện với vai trò xem tài chính (server đã lọc — FE không tự đoán).

## 2. Token badge theo loại chứng từ

| Loại | Nhãn vi | Tone |
| --- | --- | --- |
| INVOICE | Hoá đơn | info |
| PO | Đơn mua (PO) | info |
| HANDOVER | Biên bản bàn giao | neutral |
| WARRANTY | Phiếu bảo hành | success |
| PHOTO | Ảnh | neutral |

## 3. Dialog "Đính kèm chứng từ"

```
┌──────────── Đính kèm chứng từ ─────────────┐
│ Tài sản TS000003 · Máy pha cà phê           │
│                                             │
│  Loại chứng từ *   [v Chọn loại..........]  │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   ^  Kéo thả tệp vào đây hoặc bấm chọn │ │  (dropzone = label[for])
│  │   PDF, JPG, PNG, WEBP · tối đa 10MB    │ │
│  └───────────────────────────────────────┘ │
│  -> đã chọn: hoa-don.pdf (240 KB)   [x]     │
│                                             │
│  (!) lỗi loại/dung lượng cạnh vùng chọn     │
│              [Hủy]        [Tải lên]          │
└─────────────────────────────────────────────┘
```

- Flow 3 bước ẩn với người dùng: xin signed URL -> PUT tệp thẳng lên Storage (hiện spinner "Đang tải
  lên…") -> xác nhận gắn. Nút **Tải lên** `aria-busy` suốt quá trình.
- **Kiểm phía client trước khi gọi server** (mirror allowlist + 10MB) để báo lỗi tức thì (EX.1); server
  vẫn là chốt chặn cuối.
- Dropzone là `<label>` bọc `<input type=file>` ẩn (kéo-thả + bấm + bàn phím đều được); hiện tên + dung
  lượng tệp đã chọn, nút gỡ chọn.

## 4. Trạng thái

| Trạng thái | Xử lý |
| --- | --- |
| Tải danh sách | khối chứng từ đi cùng detail (đã có skeleton trang) |
| Rỗng | EmptyState gọn trong card: "Chưa có chứng từ" + gợi ý đính kèm (nếu có quyền) |
| Đang tải lên | spinner, khoá nút, không đóng dialog |
| Lỗi loại/dung lượng (EX.1) | alert cạnh vùng chọn, giữ lựa chọn |
| Lỗi kho tệp (EX.2) | alert chung + cho thử lại |
| Xem: cấp URL lỗi | toast lỗi, không mở tab |

## 5. A11y / responsive

- Dialog `max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl`; nút >=44px; dropzone focus-visible;
  `aria-busy` khi tải; alert `role="alert"`.
- Mobile: dòng chứng từ xuống 2 hàng (tên trên, meta + Xem dưới); dropzone full-width.
- `prefers-reduced-motion`: không hiệu ứng nhấp nháy; chỉ chuyển trạng thái rõ ràng.
