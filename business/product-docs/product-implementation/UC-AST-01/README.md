# UC-AST-01 — Tạo hồ sơ tài sản (kế hoạch kỹ thuật frontend)

> Màn hình đầu M03. Chỉ dựng điểm vào + biểu mẫu tạo + xác nhận. Danh sách (AST-07), chi tiết
> (AST-08), mã QR in nhãn (M04) làm sau. Thiết kế đã chốt ở `DESIGN-README.md`.

## 1. Thành phần

- `src/lib/api/assets.api.ts`: `getAssetCreateOptions()` → `GET /assets/create-options`;
  `createAsset(payload, commandKey)` → `POST /assets` kèm `Idempotency-Key`. Kiểu `AssetCreateOptions`,
  `CreateAssetPayload`, `CreatedAsset`.
- `src/lib/api/assets.queries.ts`: `assetKeys` + `assetCreateOptionsQuery` (staleTime 60s).
- `src/features/assets/create/asset-form-schema.ts`: zod schema (tên bắt buộc, uuid loại/địa điểm/
  người, status ∈ IN_STORAGE/IN_USE; serial bắt buộc **động** theo loại — truyền `serialRequired` vào
  `superRefine`). Token message → i18n ở dialog.
- `src/features/assets/create/asset-form-dialog.tsx`: hộp thoại form (react-hook-form + zodResolver),
  `SelectDropdown` cho loại/nhà cung cấp/địa điểm/người, `DateField` ngày mua, radio trạng thái, mutation
  `createAsset`, map lỗi field (serial/responsible) + lỗi chung.
- `src/features/assets/list/assets-page.tsx`: header + nút Thêm tài sản + `EmptyState` (danh sách đủ ở
  AST-07). Mở dialog.
- `src/routes/_authenticated/assets/index.tsx`: route `/assets`, component `AssetsPage`.
- i18n `assets.*` (vi nguồn + en mirror cùng khoá) + `nav.assets`; thêm mục nav (chỉ Quản lý tài sản).

## 2. Hành vi

- Mở trang → nút **Thêm tài sản** mở dialog. Dialog `useQuery(assetCreateOptionsQuery)` nạp danh sách chọn.
- Chọn loại có `serialRequired` → ô serial thành bắt buộc (EX.1). Submit thiếu serial → lỗi cạnh trường.
- Thành công → `toast('Đã tạo hồ sơ {assetCode}')`, đóng dialog. (Chưa có list để invalidate; khi làm
  AST-07 sẽ invalidate `assetKeys.list`.)
- Lỗi: `DUPLICATE_RECORD` (trùng serial) → khối chung; `RESPONSIBLE_NOT_ON_LOCATION` → lỗi cạnh trường
  người chịu trách nhiệm (EX.3); `REQUEST_TIMEOUT` → khối chung, giữ dữ liệu, cho bấm lại (cùng key).
- `Idempotency-Key` cố định mỗi lần mở dialog (BR-AST-13 / EX.6b).

## 3. Trạng thái & a11y

- Đang tải options: skeleton. Đang gửi: nút Lưu spinner + khoá. Lỗi field/chung: như DESIGN-README §4.
- `Dialog` focus trap/Esc; `<Label htmlFor>`; mobile cuộn dọc, select full-width.

## 4. Test

- `asset-form-schema.test.ts`: tên trống → lỗi; status ngoài miền → lỗi; serial bắt buộc động theo
  `serialRequired`; payload hợp lệ qua.
