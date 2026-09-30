# Kế hoạch kỹ thuật frontend — UC-MDM-08: Cập nhật danh mục phòng ban

> **Yêu cầu 2 (frontend).** UC ở backend: `.../M02-danh-muc-nen/UC-MDM-08_cap-nhat-danh-muc-phong-ban.md`. Backend: `eh_am_backend/business/product-docs/product-implementation/UC-MDM-08/README.md`.
>
> Mock UI / wireframe: [DESIGN-README.md](./DESIGN-README.md).
>
> **Trạng thái: XONG (backend core + frontend), đã kiểm chứng.** Dùng chung feature `master-data`, áp đủ các chuẩn UI bắt buộc (xem `eh_am_frontend/CLAUDE.md`). Gán trưởng phòng + ngừng chờ UC-IAM-15 / UC-MDM-07.

## 1. Tính năng người dùng thấy

Màn **Danh mục phòng ban** (chỉ Quản trị hệ thống thấy ở sidebar): danh sách mã/tên/trạng thái, tìm, lọc trạng thái, phân trang. **Thêm** (mã + tên), **Sửa** tên (mã chỉ đọc). Gán trưởng phòng + Ngừng: chưa có ở GĐ này.

## 2. File (feature `master-data/departments`)

`department-schema.ts` (+ test), `departments-columns.tsx`, `department-form-dialog.tsx`, `departments-page.tsx`; route `/master-data/departments`; nav "Phòng ban" (roles SYSTEM_ADMIN); i18n `masterData.departments.*`. API `listDepartments/createDepartment/updateDepartment` + `departmentsQueryOptions`.

## 3. Hợp đồng dữ liệu

- `GET /v1/master-data/departments?page&pageSize&status` → `{ items: DepartmentDto[], ... }`.
- `POST` `{ code, name }` → 201. `PATCH /:id` `{ name, version }` → 200.
- `DepartmentDto`: `{ id, code, name, managerId, status, version, createdAt, updatedAt }`.

## 4. Ánh xạ ngoại lệ → UI

Giống các danh mục khác: `VALIDATION_FAILED` (field), `DUPLICATE_RECORD` (field mã), `RECORD_VERSION_CONFLICT` (mời tải lại), quyền 403. Chưa có `CATALOG_ITEM_IN_USE` (luồng ngừng chưa dựng).

## 5. Kiểm chứng

`vite build` · `typecheck` · `lint` · `vitest` (schema). Không commit.
