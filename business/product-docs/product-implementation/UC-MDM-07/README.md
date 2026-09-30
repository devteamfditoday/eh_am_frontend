# Kế hoạch kỹ thuật frontend — UC-MDM-07: Cập nhật danh mục lý do

> **Yêu cầu 2 (frontend).** UC ở backend: `.../M02-danh-muc-nen/UC-MDM-07_cap-nhat-danh-muc-ly-do.md`. Backend: `eh_am_backend/business/product-docs/product-implementation/UC-MDM-07/README.md` (đọc phần "LỆCH SCHEMA vs UC": hiện có 8 nhóm, không phải 22).
>
> Mock UI: [DESIGN-README.md](./DESIGN-README.md).
>
> **Trạng thái: XONG (backend core + AC.2 + frontend), đã kiểm chứng.** Áp đủ chuẩn UI bắt buộc. **Ngừng lý do (AC.2) đã dựng** (nhóm 22 + 'CATALOG_DEACTIVATE' có runtime): nút Ngừng + `DeactivateCatalogDialog` dùng chung với UC-MDM-03, truyền `excludeReasonId` để loại chính lý do đang ngừng.

## 1. Tính năng người dùng thấy

Màn **Danh mục lý do** (chỉ SYSTEM_ADMIN): danh sách theo **nhóm** + mã + tên + trạng thái; lọc theo nhóm và trạng thái; tìm. **Thêm** (chọn nhóm + mã + tên), **Sửa** tên (mã + nhóm chỉ đọc), **Ngừng** lý do (nút ghost destructive cạnh Sửa → `DeactivateCatalogDialog`). Mục "Khác" (`isFreetext`) khoá — không sửa/ngừng (biểu tượng khoá, cả hai nút disabled).

## 2. File (feature `master-data/reason-codes`)

`reason-code-schema.ts` (+ test), `reason-codes-columns.tsx`, `reason-code-form-dialog.tsx` (select nhóm khi tạo; SYSTEM_REASON_PROTECTED), `reason-codes-page.tsx` (lọc nhóm + trạng thái). Route `/master-data/reason-codes`; nav "Lý do". i18n `masterData.reasonCodes.*` (kèm nhãn 8 nhóm). API `listReasonCodes/createReasonCode/updateReasonCode` + `reasonCodesQueryOptions`. `REASON_GROUPS` (8) ở `master-data.api.ts`.

## 3. Hợp đồng dữ liệu

- `GET ...?reasonGroup&status` → `{ items: ReasonCodeDto[], ... }`.
- `POST` `{ reasonGroup, code, label }`; `PATCH /:id` `{ label, version }`.
- `ReasonCodeDto`: `{ id, code, label, reasonGroup, isFreetext, status, version, createdAt, updatedAt }`.

## 4. Ánh xạ ngoại lệ → UI

`DUPLICATE_RECORD` (field mã, "trong nhóm này"), `RECORD_VERSION_CONFLICT` (mời tải lại), **`SYSTEM_REASON_PROTECTED`** (câu riêng cho mục "Khác"), `VALIDATION_FAILED`. Luồng ngừng: `POST /:id/deactivate` body `{ reasonCodeId, note?, version }`; lỗi map như UC-MDM-03 (không có `CATALOG_ITEM_IN_USE` vì lý do không bị tham chiếu).

## 5. Kiểm chứng

`vite build` · `typecheck` · `lint` · `vitest`. Không commit.
