# Common component EH-AM

> **Yêu cầu 1 — phần component.** Danh mục component dùng chung: primitive shadcn có sẵn, component EH-AM mới thêm, và các mẫu ghép (pattern) mà từng nhóm UC sẽ dựng ở Yêu cầu 2. Token và hệ thống: xem [10-design-tokens.md](10-design-tokens.md), [20-design-system.md](20-design-system.md).

## 1. Primitive shadcn có sẵn (`src/components/ui/`)

Đủ khối cơ bản, **không sửa tay** (do `shadcn add` sinh, đã loại khỏi lint/knip): `button`, `input`, `textarea`, `label`, `form` (react-hook-form + zod), `select`, `checkbox`, `radio-group`, `switch`, `badge`, `card`, `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip`, `tabs`, `table`, `separator`, `scroll-area`, `avatar`, `skeleton`, `sonner` (toast), `command`, `calendar`, `collapsible`, `alert`, `sidebar`.

Khối ghép sẵn của app shell: `src/components/data-table/*` (bảng dữ liệu URL-synced: toolbar, faceted-filter, column-header, pagination, view-options, bulk-actions), `src/components/layout/*` (sidebar, header, top-nav), `confirm-dialog`, `select-dropdown`, `date-picker`, `password-input`, `long-text`, `command-menu`, `search`, `theme-switch`, `profile-dropdown`.

Tài sản/phiếu → dùng lại `data-table` cho mọi danh sách; `form` + `dialog`/`sheet` cho tạo/sửa; `confirm-dialog` cho hành động không thể hoàn tác.

## 2. Component EH-AM mới (Yêu cầu 1)

Đặt ở `src/components/`, bám token, đã typecheck + lint + prettier, xác minh render thật trên `/sign-in`.

### `StatusBadge` — `src/components/status-badge.tsx`
Chip trạng thái nghiệp vụ. Props: `tone` (`neutral|success|warning|danger|info`), `variant` (`soft|solid|outline`, mặc định `soft`), `size` (`sm|md`), `dot` (chấm màu, hữu ích khi in đen trắng), `children` (nhãn).
Chỉ lo hiển thị; ánh xạ trạng thái cụ thể → `tone`+nhãn đặt cạnh từng feature (xem §4). Xuất thêm type `StatusTone`.
```tsx
<StatusBadge tone='success' dot>Đang dùng</StatusBadge>
<StatusBadge tone='info' variant='solid'>Đang vận chuyển</StatusBadge>
```

### `CodeText` — `src/components/code-text.tsx`
Hiển thị mã kỹ thuật bằng SUSE Mono. Props: `value`, `copyable` (thêm nút chép, tự báo "đã chép" ~1.2s), `label` (cho screen reader). Dùng cho mã tài sản, QR, serial, mã phiếu, toạ độ GPS, request id.
```tsx
<CodeText value='AST-2026-000123' copyable label='mã tài sản' />
```

### `PageHeader` — `src/components/page-header.tsx`
Tiêu đề trang chuẩn: `title` (Bricolage), `description`, `eyebrow` (nhãn ngữ cảnh nhỏ, ví dụ mã module dạng mono), `actions` (nút bên phải). Đặt đầu mọi màn.
```tsx
<PageHeader title='Hồ sơ tài sản' description='Danh mục tài sản và CCDC theo location.'
  actions={<Button>Thêm tài sản</Button>} />
```

### `EmptyState` — `src/components/empty-state.tsx`
Trạng thái rỗng / không kết quả / lỗi tải. Props: `icon`, `title`, `description`, `action`, `variant` (`default|error`). Khoảnh khắc thương hiệu: tiêu đề Bricolage, một dòng hướng dẫn, khoảng trắng. Màn lỗi (`variant='error'`) có `role='alert'`.

### `DescriptionList` + `DescriptionItem` — `src/components/description-list.tsx`
Danh sách nhãn–giá trị cho màn chi tiết. `DescriptionItem` tự hiện `—` khi giá trị rỗng để phân biệt "chưa có". Hai cột trên desktop, xếp dọc trên mobile.
```tsx
<DescriptionList>
  <DescriptionItem label='Mã tài sản'><CodeText value='AST-...' copyable /></DescriptionItem>
  <DescriptionItem label='Trạng thái'><StatusBadge tone='success'>Đang dùng</StatusBadge></DescriptionItem>
</DescriptionList>
```

## 3. Quy ước viết component mới

- File ở `src/components/` (dùng chung) hoặc `src/features/<module>/components/` (riêng module). `ui/` chỉ cho shadcn.
- Chỉ export component (giữ `cva`/helper nội bộ) để không vướng `react-refresh/only-export-components`; export type kèm được.
- Không hex/oklch trực tiếp: dùng class token. `cn()` để gộp class. Prettier: không chấm phẩy, nháy đơn, 80 cột.
- Có `aria-label` cho control chỉ có icon. Tôn trọng focus ring và reduced-motion.
- Comment tiếng Việt lối "⚠️ vì sao" ở quyết định không hiển nhiên.

## 4. Mẫu ghép theo nhóm UC (dựng ở Yêu cầu 2)

Các composite dưới đây **chưa dựng** (tránh làm trước màn chưa có); ghi để định hướng khi làm UC tương ứng. Mỗi cái ghép từ primitive + component §2.

- **Ánh xạ trạng thái → tone** (mỗi domain một file, ví dụ `features/assets/lib/asset-status.ts`): map enum trạng thái (theo Phụ lục B blueprint) sang `{ tone, label }` cho `StatusBadge`. Đây là chỗ duy nhất biết nghiệp vụ; `StatusBadge` giữ generic.
- **AuditTrail / Timeline** (M12, dùng ở mọi màn chi tiết): dòng thời gian Ai–Khi nào–Thay đổi gì–Trước/Sau–Lý do; dấu thời gian dùng `CodeText`/mono. Dựng khi làm UC audit.
- **AssetCard / AssetRow**: thẻ/hàng tóm tắt tài sản (mã mono, tên, location, `StatusBadge`).
- **ScopePicker / LocationSwitcher**: chọn location đang xem ở header (biên bảo mật theo location).
- **QRScannerSheet** (M04): sheet quét QR nhận diện tài sản.
- **WizardStepper** (M01 tạo tài khoản nhân viên, M03 tạo tài sản): khung nhiều bước, thanh tiến trình, điều hướng bước.
- **FilterBar theo module**: cấu hình faceted-filter của data-table cho từng danh sách.
- **KpiStat / ChartCard** (M11 dashboard): thẻ chỉ số + biểu đồ recharts dùng `--chart-1..5`.
- **ConfirmWithReason**: hộp xác nhận bắt nhập "lý do" (nhiều hành động nghiệp vụ bắt buộc lý do cho audit).
- **EmptyState/error dùng lại** cho mọi danh sách/chi tiết.

## 5. Phủ tính năng UC

"Đủ cho mọi tính năng UC" được đảm bảo bằng: (a) primitive shadcn phủ nhập liệu/điều hướng/hộp thoại; (b) data-table phủ mọi danh sách; (c) component §2 phủ các mẫu lặp xuyên module (trạng thái, mã, tiêu đề, rỗng, chi tiết); (d) mẫu ghép §4 phủ phần đặc thù, dựng đúng lúc ở Yêu cầu 2 theo từng UC. Cách này bám dặn dò "đừng dựng trước, tránh over-engineering".
