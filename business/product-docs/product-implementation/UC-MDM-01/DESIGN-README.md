# DESIGN — UC-MDM-01: Màn Danh mục location

> **Mục đích.** Chốt bố cục và cách bố trí component **trước** khi code, để bước implement chỉ còn là dựng theo bản này. Dùng design token + common component đã dựng ở Yêu cầu 1 (skill `frontend-design` + `ui-ux-pro-max`). Không thêm hiệu ứng động cho màn dữ liệu (GSAP chỉ dành cho khoảnh khắc thương hiệu ở trang đăng nhập — xem `product-design/00-nhan-dien-thuong-hieu-everyhalf.md` §7).
>
> Kế hoạch kỹ thuật: [README.md](./README.md).

## 1. Token dùng ở màn này

| Vai trò | Token | Ghi chú |
| --- | --- | --- |
| Nền trang | `--background` (paper #F9F9F6) | |
| Thẻ/bảng | `--card` + `--border` (#E5E3DD) | viền mảnh, radius `--radius` (0.5rem) |
| Chữ tiêu đề | font `--font-bricolage` | PageHeader title |
| Chữ thân | font `--font-sans` (Inter) | |
| Mã location | font `--font-mono` (SUSE Mono) qua `CodeText` | không hiện mã thô ở nơi khác |
| Trạng thái | `StatusBadge`: Đang hoạt động → `success`, Ngừng → `muted/neutral` | |
| Nút chính | `Button` mặc định (ink) | "Thêm location", "Lưu" |

## 2. Wireframe — trang danh sách (desktop ≥ 1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Danh mục location                                     [ + Thêm location ] │  ← PageHeader (title Bricolage + mô tả 1 dòng + action phải)
│  Nơi ghi nhận tài sản và phạm vi gán vai trò.                              │
├──────────────────────────────────────────────────────────────────────────┤
│  [ 🔍 Tìm mã hoặc tên… ]   [ Loại ▾ ]  [ Trạng thái ▾ ]        [ ⚙ Cột ▾ ]│  ← DataTable toolbar (search trái, faceted-filter, view-options phải)
├─────────┬───────────────────────┬───────────┬──────────────────┬──────────┤
│ MÃ      │ TÊN                   │ LOẠI      │ COST CENTER       │ TRẠNG THÁI│  ← column-header (sort được ở MÃ, TÊN)
├─────────┼───────────────────────┼───────────┼──────────────────┼──────────┤
│ Q1      │ Cửa hàng Quận 1       │ Cửa hàng  │ CC-STORE-01       │ ● Đang HĐ │ ⋯ │
│ KHO-HCM │ Kho trung tâm HCM     │ Kho       │ CC-WH-01          │ ● Đang HĐ │ ⋯ │
│ XR-01   │ Xưởng rang Thủ Đức    │ Xưởng rang│ CC-ROAST-01       │ ● Đang HĐ │ ⋯ │
│ VP-HO   │ Văn phòng Hội sở      │ Văn phòng │ CC-OFFICE-01      │ ● Đang HĐ │ ⋯ │
│ SC-ABC  │ Đơn vị sửa ABC        │ Bên ngoài │ CC-EXT-01         │ ○ Ngừng   │ ⋯ │  ← dòng Ngừng: chữ mờ hơn, menu ⋯ chỉ có "Xem"
├─────────┴───────────────────────┴───────────┴──────────────────┴──────────┤
│  5 / 5 dòng                                        [◀]  Trang 1/1  [▶]      │  ← pagination
└──────────────────────────────────────────────────────────────────────────┘
```

- Mã ở cột MÃ render bằng `CodeText` (SUSE Mono). Cột COST CENTER cũng là mã → `CodeText`.
- Menu `⋯` (dropdown-menu) mỗi dòng: **Sửa** (ẩn/disable khi Ngừng hoạt động hoặc thiếu quyền), **Xem chi tiết**.
- Nút **+ Thêm location** ẩn nếu người dùng không có vai trò (lớp phụ; backend vẫn là biên bảo mật).

## 3. Wireframe — dialog Thêm / Sửa

```
        ┌────────────────────────────────────────────┐
        │  Thêm location                          [✕] │  ← DialogHeader (tiêu đề đổi theo mode)
        │  Điền thông tin location mới.                │     mode edit: "Sửa location — Q1"
        ├────────────────────────────────────────────┤
        │  Mã location *        ┌────────────────────┐│  ← edit: input disabled + hint "Không đổi được"
        │                       │ Q1                 ││
        │                       └────────────────────┘│
        │  Tên location *       ┌────────────────────┐│
        │                       │ Cửa hàng Quận 1    ││
        │                       └────────────────────┘│
        │  Loại *               [ Cửa hàng        ▾ ] │  ← select 5 loại; edit: disabled
        │  Địa chỉ              ┌────────────────────┐│  ← textarea (tuỳ chọn)
        │                       │ 123 Nguyễn Huệ…    ││
        │                       └────────────────────┘│
        │  Cost center mặc định*[ CC-STORE-01     ▾ ] │  ← select cost center ACTIVE (CodeText trong option)
        ├────────────────────────────────────────────┤
        │                       [ Huỷ ]   [ Lưu ]      │  ← DialogFooter
        └────────────────────────────────────────────┘
```

- Form: `react-hook-form` + Zod (`location-schema.ts`). `*` = bắt buộc.
- **Mode edit**: field **Mã** và **Loại** `disabled` + hint "Không đổi được sau khi tạo" (Giả định 2). Giữ `version` ẩn trong form state để gửi PATCH.
- Lỗi field hiện ngay dưới input (`ui/form` FormMessage). Lỗi trùng mã (EX.2) gắn vào field Mã.
- Nút **Lưu** ở trạng thái loading khi đang gọi API; disable khi form không hợp lệ.

## 4. Các trạng thái màn hình

| Trạng thái | Hiển thị |
| --- | --- |
| Đang tải | Skeleton bảng (dùng `ui/skeleton`), giữ chiều cao để không nhảy layout. |
| Rỗng (chưa có location) | `EmptyState`: icon + "Chưa có location nào" + nút "Thêm location đầu tiên". |
| Rỗng do lọc | `EmptyState` nhẹ: "Không có location khớp bộ lọc" + nút "Xoá bộ lọc". |
| Lỗi tải danh sách | Alert đỏ nhạt (`ui/alert` destructive-subtle) + nút "Thử lại". |
| Xung đột phiên (EX.4) | Trong dialog: alert "Có người vừa sửa location này." + nút **Tải lại** (refetch + đóng form). Không mất dữ liệu người dùng đã gõ cho tới khi họ bấm Tải lại. |
| Lưu thành công | Toast (`sonner`) "Đã lưu location {mã}", đóng dialog, dòng hiện/nhấp nháy nhẹ 1 lần trong bảng. |

## 5. Responsive / PWA (§responsive)

- **≥ 1024px**: bảng đầy đủ như §2; dialog ở giữa màn.
- **640–1023px**: ẩn cột ít quan trọng (COST CENTER gộp xuống dòng phụ dưới TÊN); toolbar filter gộp vào nút "Lọc ▾".
- **< 640px (điện thoại)**: bảng cuộn ngang trong khung; **dialog chuyển thành `Sheet` trượt từ dưới lên, chiếm ~90% chiều cao**, footer nút dính đáy. Vùng chạm nút ≥ 44px.
- Tôn trọng `prefers-reduced-motion`: bỏ hiệu ứng nhấp nháy dòng mới.

## 6. Khả năng tiếp cận

- Mỗi input có `<label>` liên kết; lỗi field đọc được bằng `aria-describedby`.
- Dialog bẫy focus, đóng bằng `Esc`, trả focus về nút đã mở.
- Trạng thái không chỉ dựa vào màu: `StatusBadge` có cả chấm + chữ ("Đang hoạt động"/"Ngừng").
- Bảng có `<caption>` ẩn cho trình đọc màn hình: "Danh sách location".

## 7. Skill dùng cho màn này

`frontend-design` (bố cục hero-less cho màn dữ liệu, thang chữ, kỷ luật token) + `ui-ux-pro-max` (mẫu bảng + form + trạng thái rỗng/lỗi) + `taste-skill` (rà lại tổng thể). Không dùng `gsap-skills`/`hyperframes`/`impeccable` cho màn dữ liệu nội bộ này.

## 8. Wireframe sửa lỗi địa chỉ và cost center (2026-10-01)

```text
┌──────────────────────────────────────────────┐
│ Địa chỉ *                                    │
│ [ Tỉnh/Thành *             ▾ ] [ Phường/Xã * ▾ ] │
│ [ Số nhà, tên đường *                         ] │
│   Thiếu một lựa chọn → lỗi ngay dưới control,  │
│   nút Lưu không phát sinh request API.          │
└──────────────────────────────────────────────┘

Danh sách:  COST CENTER
            [ CC-STORE-01 ]  ← hover/focus: “Vận hành cửa hàng”
```

- Hai dropdown dùng vùng chạm tối thiểu 44px trên mobile; khi đổi tỉnh phải xoá lựa chọn phường cũ.
- Tooltip mở bằng hover và keyboard focus, nội dung là tên cost center; mã vẫn dùng `CodeText`.
- Không thêm animation; ưu tiên tính rõ ràng của form dữ liệu và hỗ trợ `prefers-reduced-motion` sẵn có.
