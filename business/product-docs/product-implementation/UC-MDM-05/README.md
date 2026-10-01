# Kế hoạch kỹ thuật frontend - UC-MDM-05: Cập nhật danh mục nhà cung cấp

> UC nguồn: `eh_am_backend/business/product-docs/product-usecase/M02-danh-muc-nen/UC-MDM-05_cap-nhat-danh-muc-nha-cung-cap.md`.
>
> Thiết kế bắt buộc: [DESIGN-README.md](./DESIGN-README.md).
>
> **Trạng thái:** Đã triển khai; backend migration + RPC smoke xanh, FE full test/build xanh. Chờ manual test giao diện.

## 1. Tính năng người dùng thấy

- Xem danh sách nhà cung cấp gồm tên, mã số thuế, người liên hệ và trạng thái.
- Tìm theo tên, mã số thuế hoặc thông tin liên hệ; lọc trạng thái; phân trang trên bảng.
- Tìm kiếm, lọc và phân trang chạy phía server để không mất các nhà cung cấp sau dòng thứ 100.
- Thêm và sửa nhà cung cấp. Chỉ tên bắt buộc; mã số thuế và ba trường người liên hệ có thể để trống.
- Ngừng nhà cung cấp bằng lý do nhóm `CATALOG_DEACTIVATE`; nhà cung cấp đã ngừng không còn trong danh sách chọn của hồ sơ mới.
- Khi xung đột phiên, giữ form và mời tải lại. Khi trùng mã số thuế, chỉ lỗi ngay tại trường mã số thuế và nêu tên nhà cung cấp đang giữ mã đó.

## 2. Bản đồ file

| File | Trách nhiệm |
| --- | --- |
| `src/lib/api/master-data.api.ts` | `SupplierDto`, list/create/update/deactivate; gửi `Idempotency-Key` cho lệnh ghi |
| `src/lib/api/master-data.queries.ts` | key và `suppliersQueryOptions` |
| `src/features/master-data/suppliers/supplier-schema.ts` | Zod validation + chuẩn hoá dữ liệu form |
| `src/features/master-data/suppliers/supplier-schema.test.ts` | RED/GREEN cho tên, tax ID, phone, email và trường tùy chọn |
| `src/features/master-data/suppliers/suppliers-columns.tsx` | Cột bảng và thao tác sửa/ngừng |
| `src/features/master-data/suppliers/supplier-form-dialog.tsx` | Dialog thêm/sửa, lỗi field và version conflict |
| `src/features/master-data/suppliers/suppliers-page.tsx` | Header/Main, trạng thái tải/rỗng/lỗi, bảng, dialog |
| `src/routes/_authenticated/master-data/suppliers.tsx` | Route mỏng + prefetch |
| `src/components/layout/data/sidebar-data.ts` | Mục Nhà cung cấp cho hai vai trò được phép |
| `src/lib/i18n/locales/{vi,en}.ts` | Toàn bộ nội dung hiển thị |

## 3. Hợp đồng API

- `SupplierDto`: `{ id, name, taxId, contactName, contactPhone, contactEmail, status, version, createdAt, updatedAt }`.
- `GET /master-data/suppliers?page&pageSize&status`.
- `POST /master-data/suppliers` body `{ name, taxId?, contactName?, contactPhone?, contactEmail? }`.
- `PATCH /master-data/suppliers/:id` thêm `version`.
- `POST /master-data/suppliers/:id/deactivate` body `{ reasonCodeId, note?, version }`.
- Mỗi lần người dùng bắt đầu thao tác ghi tạo một UUID bằng `crypto.randomUUID()`. Key giữ nguyên khi timeout/retry và chỉ thay sau phản hồi thành công hoặc khi chuyển sang đối tượng khác.

## 4. Ánh xạ lỗi sang UI

| Mã | Hiển thị |
| --- | --- |
| `VALIDATION_FAILED` | Lỗi cạnh trường tương ứng; với ngừng thì gắn vào lý do/note |
| `DUPLICATE_RECORD` | Lỗi cạnh `taxId`, dùng `existingName` từ params nếu có |
| `RECORD_VERSION_CONFLICT` | Alert trong dialog + nút Tải lại |
| `ROLE_REQUIRED`, `ACCOUNT_INACTIVE` | Global handler theo mã |
| `REQUEST_TIMEOUT` | Giữ form và command key; nhắc tải danh sách hoặc thử lại |
| lỗi khác | Global handler + request ID |

## 5. Kế hoạch TDD

1. RED schema: tên bắt buộc; mã số thuế chỉ nhận 10 số hoặc `10 số-3 số`; phone/email hợp lệ; chuỗi rỗng ở trường tùy chọn thành `undefined`.
2. GREEN schema và helper chuẩn hoá tối thiểu.
3. RED API: header idempotency được gửi cho create/update/deactivate.
4. GREEN API/query types.
5. RED UI ở mức hành vi cần thiết: edit giữ version, duplicate gắn vào tax ID, conflict không đóng dialog.
6. GREEN form/page/columns/route/nav/i18n; dùng `DeactivateCatalogDialog` với nhãn supplier.
7. Refactor giữ toàn bộ test xanh.

## 6. Kiểm chứng và cổng dừng

`npm run typecheck && npm run lint && npm test && npx vite build`.

Sau kiểm chứng, manual test desktop/mobile ở cổng 5175 khi có phiên đăng nhập. Theo chỉ đạo mới ngày 2026-10-01, tiếp tục UC-MDM-06 trong cùng phiên, không commit.
