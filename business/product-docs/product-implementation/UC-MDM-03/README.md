# Kế hoạch kỹ thuật frontend — UC-MDM-03: Cập nhật danh mục cost center

> **Yêu cầu 2 (frontend).** UC: `eh_am_backend/business/product-docs/product-usecase/M02-danh-muc-nen/UC-MDM-03_cap-nhat-danh-muc-cost-center.md`. Tính năng F-MDM-03. Backend: `eh_am_backend/business/product-docs/product-implementation/UC-MDM-03/README.md`.
>
> Mock UI / wireframe: [DESIGN-README.md](./DESIGN-README.md) — đọc trước khi code.
>
> **Trạng thái: XONG (backend core + AC.2 + frontend), đã kiểm chứng.** FE: `typecheck` ✅ · `lint` 0 error ✅ · `vitest` ✅. Dùng chung feature `master-data`. **Ngừng cost center (AC.2) đã dựng:** nút Ngừng cạnh Sửa + `DeactivateCatalogDialog` (chọn lý do nhóm CATALOG_DEACTIVATE, ô ghi thêm khi 'Khác'); backend kiểm location đang dùng, kiểm tài sản hoãn tới M03. Chờ Duy manual test.

## 1. Tính năng người dùng thấy

Màn **Danh mục cost center** (Quản trị hệ thống / Quản lý tài sản):

- **Xem danh sách** cost center: mã, tên, trạng thái. Tìm theo mã/tên, lọc theo trạng thái, phân trang.
- **Thêm cost center**: dialog nhập mã (theo danh mục FAST) + tên → lưu.
- **Sửa**: dialog sửa **tên**; **mã chỉ đọc** (BR-MDM-17).
- **Ngừng hoạt động (AC.2):** nút **Ngừng** (ghost, chữ destructive) cạnh Sửa, disabled khi dòng đã INACTIVE. Mở `DeactivateCatalogDialog`: chọn lý do từ nhóm "Ngừng mục danh mục" (Đang HĐ); nhập ô ghi thêm khi lý do là "Khác"; xác nhận. Còn dùng → alert đỏ (`CATALOG_ITEM_IN_USE`); xung đột phiên → mời tải lại.

## 2. Bản đồ file (thêm vào feature `master-data`)

| File | Trách nhiệm |
| --- | --- |
| `src/lib/api/master-data.api.ts` | Thêm hàm `listCostCenters(params)`, `createCostCenter`, `updateCostCenter` (đã có phần location). |
| `src/lib/api/master-data.queries.ts` | Thêm `costCentersQueryOptions(params)` + key. Ô chọn của UC-MDM-01 gọi `costCentersQueryOptions({ status: 'ACTIVE' })`. |
| `src/features/master-data/cost-centers/cost-centers-page.tsx` | Trang danh sách + toolbar + nút Thêm. |
| `src/features/master-data/cost-centers/cost-centers-columns.tsx` | Cột: `CodeText` (mã), tên, `StatusBadge`. |
| `src/features/master-data/cost-centers/cost-center-form-dialog.tsx` | Dialog tạo/sửa (mã readonly ở edit). |
| `src/features/master-data/cost-centers/cost-center-schema.ts` | Zod: mã 2–20 `^[A-Za-z0-9][A-Za-z0-9_-]*$`, tên ≤150. |
| `src/routes/_authenticated/master-data/cost-centers.tsx` | Route + loader prefetch. |
| i18n | Khối `masterData.costCenters.*`. |

## 3. Hợp đồng dữ liệu

- `GET /v1/master-data/cost-centers?page&pageSize&status` → `{ items: CostCenterDto[], page, pageSize, total }`.
- `POST` body `{ code, name }` → `201 CostCenterDto`.
- `PATCH /:id` body `{ name, version }` → `200 CostCenterDto`.
- `CostCenterDto`: `{ id, code, name, status, version, createdAt, updatedAt }`.

## 4. Ánh xạ ngoại lệ → giao diện

Giống UC-MDM-01: `VALIDATION_FAILED` (theo field), `DUPLICATE_RECORD` (field mã), `RECORD_VERSION_CONFLICT` (mời tải lại), `ROLE_REQUIRED`/`ACCOUNT_INACTIVE` (quyền). Luồng ngừng thêm: `CATALOG_ITEM_IN_USE` (409) → alert đỏ trong dialog dùng câu backend; `VALIDATION_FAILED` khi lý do sai nhóm/thiếu ô ghi thêm → gắn field lý do.

Endpoint ngừng: `POST /v1/master-data/cost-centers/:id/deactivate` body `{ reasonCodeId, note?, version }` → `200 CostCenterDto`.

## 5. Kế hoạch test (TDD)

- `cost-center-schema.test.ts`; `master-data.api.test.ts` (phần cost center); `cost-center-form-dialog.test.tsx` (create vs edit mã readonly; version conflict).

## 6. Kiểm chứng

`npx tsc --noEmit` · `npm run lint` · `npm test` · `npm run build`. Không commit.
