# Kế hoạch kỹ thuật frontend — UC-MDM-01: Cập nhật danh mục location

> **Yêu cầu 2 (frontend).** UC: `eh_am_backend/business/product-docs/product-usecase/M02-danh-muc-nen/UC-MDM-01_cap-nhat-danh-muc-location.md`. Tính năng F-MDM-01. Soạn theo `/ecc:plan` + `tdd-workflow` (bảng skill ở `CLAUDE.md`). Backend tương ứng: `eh_am_backend/business/product-docs/product-implementation/UC-MDM-01/README.md`.
>
> **Frontend chỉ mô tả tính năng** (theo yêu cầu). Mock UI / wireframe nằm ở [DESIGN-README.md](./DESIGN-README.md) — đọc file đó trước khi code màn hình.
>
> **Trạng thái: XONG (backend + frontend), đã kiểm chứng.** Migration 02/02b/02c/02d + `gen:types` đã chạy. FE: `vite build` ✅ · `typecheck` ✅ · `lint` 0 error ✅ · schema test 8/8 ✅. Đây là màn nghiệp vụ ĐẦU TIÊN của web — đã lập khuôn feature `master-data` (api → queries → data-table → form) cho các danh mục M02 còn lại. Chờ Duy manual test.

## 1. Tính năng người dùng thấy

Màn quản trị **Danh mục location** cho Quản trị hệ thống và Quản lý tài sản:

- **Xem danh sách** location: mã, tên, loại, cost center mặc định, trạng thái. Tìm theo mã/tên, lọc theo loại và trạng thái, phân trang.
- **Thêm location**: mở dialog nhập mã, tên, loại, địa chỉ, cost center mặc định → lưu → dòng mới hiện trong bảng.
- **Sửa location**: mở dialog với dữ liệu hiện tại; **mã và loại chỉ đọc** (BR-MDM-17, Giả định 2); sửa tên, địa chỉ, cost center mặc định → lưu.
- Location **Ngừng hoạt động** chỉ xem, không sửa (nút Sửa ẩn/vô hiệu).

## 2. Bản đồ file (feature `master-data`)

| File | Trách nhiệm |
| --- | --- |
| `src/lib/api/master-data.api.ts` | Bọc mỏng endpoint `/v1/master-data/locations` (list/create/update) — một hàm một endpoint, theo mẫu `auth.api.ts`. Kiểu `LocationDto`, `CreateLocationInput`, `UpdateLocationInput`. |
| `src/lib/api/master-data.queries.ts` | `locationsQueryOptions(params)` (TanStack Query) + query key factory `locationKeys`. Mutation tạo/sửa `invalidate` lại list. |
| `src/features/master-data/locations/locations-page.tsx` | Trang: `PageHeader` + toolbar (search/filter/nút Thêm) + `DataTable`. |
| `src/features/master-data/locations/locations-columns.tsx` | Định nghĩa cột TanStack Table; dùng `CodeText`, `StatusBadge`, nhãn loại i18n; cột thao tác (Sửa). |
| `src/features/master-data/locations/location-form-dialog.tsx` | Dialog tạo/sửa dùng `ui/dialog` + `ui/form` (react-hook-form + Zod); `mode: 'create' \| 'edit'`. |
| `src/features/master-data/locations/location-schema.ts` | Zod schema khớp ràng buộc backend (mã 2–20 ký tự `^[A-Za-z0-9][A-Za-z0-9_-]*$`, tên ≤150, địa chỉ ≤300, loại ∈ 5 loại). |
| `src/routes/_authenticated/master-data/locations.tsx` | Route TanStack Router; `loader` prefetch `locationsQueryOptions`. |
| `src/lib/i18n/locales/vi.ts` + `en.ts` | Khối `masterData.locations.*`: nhãn cột, 5 nhãn loại, nhãn trạng thái, tiêu đề dialog, nút, thông báo. |
| `src/lib/api/error-code.ts` | Bổ sung `RECORD_VERSION_CONFLICT` nếu chưa có (để hiện câu "tải lại" đúng EX.4). |

## 3. Hợp đồng dữ liệu với backend

- `GET /v1/master-data/locations?page&pageSize` → `{ items: LocationDto[], page, pageSize, total }` (PaginatedResult dùng `items`).
- `POST /v1/master-data/locations` body `{ code, name, type, address?, defaultCostCenterId }` + header idempotency key (client sinh, QĐ-01) → `201 LocationDto`.
- `PATCH /v1/master-data/locations/:id` body `{ name, address?, defaultCostCenterId, version }` → `200 LocationDto`.
- `LocationDto`: `{ id, code, name, type, address, defaultCostCenterId, status, version, createdAt, updatedAt }` (camelCase, đã map ở backend `toLocationModel`).
- Danh sách cost center Đang hoạt động để chọn: dùng lại API cost center của UC-MDM-03 (khi có), endpoint `/v1/master-data/cost-centers?status=ACTIVE`. **Phụ thuộc:** UC-MDM-03 backend. Trước khi có, form ghi rõ "cần cost center" và không cho lưu.

## 4. Ánh xạ ngoại lệ UC → giao diện (phân nhánh theo `code`, không theo `message`)

| Ngoại lệ UC | `code` | Xử lý FE |
| --- | --- | --- |
| EX.1 dữ liệu sai | `VALIDATION_FAILED` (400) | Zod chặn trước; nếu backend vẫn trả, gắn lỗi vào từng field theo `errors[]`, giữ nguyên dữ liệu đã nhập. |
| EX.2 trùng mã | `DUPLICATE_RECORD` (409) | Gắn lỗi vào field mã: "Mã đã dùng (kể cả location đã ngừng)". |
| EX.3 thiếu quyền | `ROLE_REQUIRED` / `ACCOUNT_INACTIVE` (403) | Toast + route guard đẩy về trang phù hợp; ẩn nút Thêm/Sửa nếu không đủ vai trò (lớp phụ). |
| EX.4 sửa đồng thời | `RECORD_VERSION_CONFLICT` (409) | Dialog báo "Có người vừa sửa, tải lại dữ liệu mới nhất"; nút Tải lại → refetch + đóng form. |
| EX.6 timeout/gửi trùng | `REQUEST_TIMEOUT` (408) | Toast đề nghị tải lại danh sách kiểm tra; **giữ idempotency key** khi bấm lại để không tạo trùng. |

## 5. Điểm kỹ thuật chốt

- **Vai trò là quyết định của server** (`auth.queries.ts`): ẩn nút theo `platformRoles`/`isSuperAdmin` chỉ là lớp phụ; backend mới là biên bảo mật. Không tự suy quyền từ token.
- **Idempotency key**: client sinh (uuid) một lần khi mở form tạo, gửi ở header; bấm Lưu lại dùng cùng key (QĐ-01, EX.6).
- **Optimistic lock**: form sửa giữ `version` của bản đang mở, gửi kèm PATCH; 409 → luồng EX.4.
- **Nhãn loại/trạng thái i18n**: không hiện mã thô (`STORE`, `ACTIVE`) — map qua i18n; mã kỹ thuật hiện bằng `CodeText` (font SUSE Mono).
- **PWA/responsive**: bảng cuộn ngang trên mobile; dialog thành sheet toàn màn ở màn hẹp (xem DESIGN-README §responsive).

## 6. Kế hoạch test (TDD — RED→GREEN)

- `location-schema.test.ts`: Zod chấp nhận/từ chối đúng ràng buộc mã, tên, địa chỉ, loại.
- `master-data.api.test.ts`: gọi đúng path/method/body; gắn idempotency header ở create.
- `location-form-dialog.test.tsx` (Testing Library): mode create vs edit (mã/loại readonly ở edit); map `errors[]` vào field; nhánh `RECORD_VERSION_CONFLICT` hiện lời tải lại.
- `locations-columns.test.tsx`: render nhãn loại/trạng thái i18n, ẩn nút Sửa khi Ngừng hoạt động.

## 7. Kiểm chứng trước khi báo xong

`npx tsc --noEmit` (hoặc `npm run typecheck`) · `npm run lint` · `npm test` · `npm run build`. Manual test (cổng Yêu cầu 3): xem danh sách, thêm đủ 5 loại, sửa, thử trùng mã, thử sửa đồng thời hai tab. Không commit (chờ Duy).
