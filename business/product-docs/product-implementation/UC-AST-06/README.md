# UC-AST-06 — Đính kèm chứng từ tài sản (kế hoạch kỹ thuật frontend)

> Khối **Chứng từ** trên trang chi tiết + dialog tải lên trực tiếp trình duyệt → Supabase Storage. Thiết
> kế theo `DESIGN-README.md` (hoà hệ thiết kế Every Half). Tải lên 3 bước ẩn với người dùng.

## 1. Thành phần

- `src/lib/api/assets.api.ts`: `requestDocumentUploadUrl(assetId, meta)` → `{uploadUrl, token, path}`;
  `uploadFileToSignedUrl(uploadUrl, file)` (PUT thẳng, không qua server); `confirmAssetDocument(assetId,
  payload)`; `getAssetDocumentUrl(assetId, docId)` → `{url}`. Hằng `ASSET_DOCUMENT_TYPES`,
  `ALLOWED_DOCUMENT_CONTENT_TYPES`, `MAX_DOCUMENT_SIZE_BYTES` (mirror server).
- `src/features/assets/documents/asset-document-upload-dialog.tsx`: chọn loại + dropzone + kiểm
  loại/dung lượng client + chạy 3 bước; `useMutation`, spinner, xử lý lỗi EX.1/EX.2.
- `src/features/assets/documents/asset-documents-card.tsx`: khối danh sách trên chi tiết (badge loại,
  tên tệp, người tải/ngày, nút Xem mở signed URL); nút Đính kèm (gated). EmptyState khi rỗng.
- `asset-detail-page.tsx`: thay card "Chứng từ" rỗng bằng `AssetDocumentsCard`.
- i18n `assets.documents.*` (vi + en) gồm nhãn loại chứng từ.
- Kiểu `AssetDocument` lấy từ `AssetDetail.documents` (đã có từ BE: id, docType, fileName, contentType,
  sizeBytes, uploadedByName, uploadedAt).

## 2. Phân quyền hiển thị

- Nút Đính kèm: `hasAnyRole(user, [ASSET_MANAGER, ASSET_ACCOUNTANT])` + `!readOnly`.
- Danh sách: server đã lọc hoá đơn/PO theo vai trò tài chính (BR-CMN-06) — FE chỉ render những gì nhận.

## 3. Luồng tải lên (ẩn 3 bước)

1. `requestDocumentUploadUrl` (kiểm quyền + loại/dung lượng ở server) → signed URL.
2. `uploadFileToSignedUrl` PUT tệp thẳng lên Storage (request tới server BE không mang nội dung tệp).
3. `confirmAssetDocument` → gắn metadata + audit; invalidate `assetKeys.detail(id)` để refresh danh sách.

## 4. Trạng thái & a11y

- Theo `DESIGN-README.md`: loading (skeleton trang), empty (trong card), uploading (spinner, khoá nút),
  lỗi loại/dung lượng (alert cạnh dropzone), lỗi kho tệp (alert chung). Dialog a11y + responsive.

## 5. Test

- `asset-document-validation.test.ts`: hàm kiểm loại/dung lượng client (allowlist + 10MB) đúng/sai.
