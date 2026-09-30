# Kế hoạch kỹ thuật frontend — UC-MDM-04: Cây loại tài sản

> **Yêu cầu 2 (frontend).** UC ở backend: `.../M02-danh-muc-nen/UC-MDM-04_cap-nhat-cay-loai-tai-san.md`. Backend: `eh_am_backend/.../UC-MDM-04/README.md`.
>
> Mock UI: [DESIGN-README.md](./DESIGN-README.md) — đọc trước khi code.
>
> **Trạng thái: XONG, đã kiểm chứng.** `vite build` ✅ · `typecheck` ✅ · `lint` 0 lỗi ✅ · `vitest` ✅. Áp đủ chuẩn UI bắt buộc (`eh_am_frontend/CLAUDE.md`).

## 1. Tính năng người dùng thấy

Màn **Cây loại tài sản** (Quản lý tài sản / Quản trị hệ thống):

- **Cây 2 cấp**: mỗi nhóm là một khối, các loại thụt lề bên dưới. Dựng từ danh sách phẳng `listAssetTypes` theo `parentId`.
- **Thêm nhóm** (mã + tên); **Thêm loại** ngay trên hàng nhóm (nhóm cha khoá sẵn); **Sửa** nhóm/loại (mã + nhóm cha chỉ đọc); **Ngừng** nhóm/loại.
- Loại hiển thị cờ **TSCĐ/CCDC** (badge chữ, map i18n từ `assetKind`) + chip **"Cần serial"** khi `serialRequired`.
- Tìm theo mã/tên; công tắc **Hiện mục đã ngừng** (mặc định chỉ hiện ACTIVE).

## 2. File (feature `master-data/asset-types`)

`asset-type-schema.ts` (+test), `asset-types-page.tsx` (render cây), `asset-type-group-form-dialog.tsx`, `asset-type-form-dialog.tsx` (Select phân loại, Switch serial, ô thời gian/mã FAST). Route `/master-data/asset-types`; nav "Loại tài sản". Ngừng dùng chung `DeactivateCatalogDialog`. API `listAssetTypes/createAssetTypeGroup/createAssetType/updateAssetTypeGroup/updateAssetType/deactivateAssetType` + `assetTypesQueryOptions`. i18n `masterData.assetTypes.*` + `nav.assetTypes`.

## 3. Hợp đồng dữ liệu

- `GET ...?status` → `{ items: AssetTypeDto[], ... }` (phẳng).
- `AssetTypeDto`: `{ id, parentId, code, name, assetKind, serialRequired, usefulLifeMonths, fastGroupCode, status, version, ... }`. `parentId=null` → nhóm.
- Tạo/sửa loại: `usefulLifeMonths` (số nguyên dương, không bắt buộc) + `fastGroupCode` (≤20, không bắt buộc) — form giữ chuỗi, gửi số/undefined.

## 4. Ánh xạ ngoại lệ → UI

`DUPLICATE_RECORD` (field mã), `RECORD_VERSION_CONFLICT` (mời tải lại), `VALIDATION_FAILED` (nhóm cha/lý do), `CATALOG_ITEM_IN_USE` (ngừng nhóm còn loại → alert đỏ trong dialog Ngừng).

## 5. Kiểm chứng

`vite build` · `typecheck` · `lint` · `vitest`. Không commit.
