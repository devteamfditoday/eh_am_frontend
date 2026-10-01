# UC-AST-07 — Tra cứu danh sách tài sản (kế hoạch kỹ thuật frontend)

> Biến trang `/assets` (điểm vào UC-AST-01) thành danh sách thật: tìm + lọc + phân trang, phạm vi
> theo vai trò do server áp. Xuất Excel (AC.1) HOÃN (chờ kho tệp). Chi tiết (AST-08) làm sau.

## 1. Thành phần

- `src/lib/api/assets.api.ts`: `listAssets(params)` → `GET /assets`; kiểu `AssetListItem`,
  `ListAssetsParams`, hằng `ASSET_LIFECYCLE_STATUSES` / `ASSET_PHYSICAL_CONDITIONS`.
- `src/lib/api/assets.queries.ts`: `assetsListQueryOptions` (keepPreviousData — giữ trang khi đổi
  lọc/429, EX.4) + `assetKeys.list`.
- `src/features/assets/list/assets-columns.tsx`: cột Asset ID, tên (+serial), loại, địa điểm, người
  chịu trách nhiệm, trạng thái, tình trạng (StatusBadge). **Không có cột giá trị** (BR-CMN-06).
- `src/features/assets/list/assets-page.tsx`: tìm (debounce 300ms) + bộ lọc + bảng
  (`useReactTable` manual) + `DataTablePagination`; nút Thêm tài sản mở `AssetFormDialog`.
- i18n `assets.list.*`, `assets.lifecycleFull.*`, `assets.condition.*` (vi + en).

## 2. Phân quyền hiển thị

- Server áp phạm vi: Quản lý tài sản/Kế toán tài sản thấy mọi địa điểm; Quản lý điểm chỉ địa điểm
  được gán; vai trò khác → 403 (service).
- Nút **Thêm tài sản** chỉ hiện khi `hasAnyRole(user, [ASSET_MANAGER])` (location manager xem nhưng
  không tạo được).
- Bộ lọc **loại** + **địa điểm** lấy từ `create-options` (chỉ Quản lý tài sản gọi được) → với Quản
  lý điểm (403) hai bộ lọc này tự ẩn; bộ lọc **trạng thái** + **tình trạng** là enum tĩnh, luôn hiện.

## 3. Trạng thái

| Trạng thái | Xử lý |
| --- | --- |
| Đang tải | 6 skeleton rows, `aria-busy` |
| Lỗi tải (EX.4) | `EmptyState` lỗi + nút Thử lại; giữ từ khoá/lọc |
| Rỗng, chưa lọc | EmptyState mời tạo (nút chỉ khi được tạo) |
| Rỗng, có lọc (AC.2) | EmptyState "không khớp", giữ lọc |
| Có dữ liệu | bảng + phân trang server (manual) |

## 4. A11y / responsive

- Bảng cuộn ngang (`min-w`, `overflow-x-auto`); ô tìm + select ≥44px chạm; mỗi select có `<Label>`.
- `keepPreviousData` tránh nháy trống khi đổi trang/lọc.

## 5. Test

- `assets-columns.test.ts`: đúng 7 cột theo thứ tự; không có cột giá trị/cost.
