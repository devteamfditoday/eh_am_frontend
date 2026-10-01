# Kế hoạch kỹ thuật frontend — UC-MDM-06: Đơn vị sửa chữa

> Viết trước code ngày 2026-10-01. Backend plan: `eh_am_backend/business/product-docs/product-implementation/UC-MDM-06/README.md`. Wireframe bắt buộc: [DESIGN-README.md](./DESIGN-README.md).

## 1. Luồng người dùng

- Danh sách: tên, dịch vụ, location bên ngoài, liên hệ, trạng thái; tìm kiếm server-side, lọc trạng thái, phân trang server-side.
- Thêm: tên bắt buộc; chọn ít nhất một trong Sửa chữa/Bảo hành; chọn location bên ngoài đang hoạt động và chưa gắn đơn vị.
- Sửa: location hiển thị chỉ đọc; tên, liên hệ và loại dịch vụ được sửa, mang version.
- Ngừng: dùng `DeactivateCatalogDialog`; backend đóng cả đơn vị và location. Copy giải thích rõ ảnh hưởng này trước xác nhận.
- Không có location phù hợp: empty state trong form kèm nút tới Danh mục location để tạo loại Bên ngoài.

## 2. Bản đồ file

- `src/features/master-data/repair-vendors/`: schema + test, columns, form dialog, page.
- `master-data.api.ts/queries.ts`: DTO/input/list/available locations/mutation.
- route `/master-data/repair-vendors`, sidebar, vi/en.
- Tái dùng `NumericInput kind='phone'`, common data table, tooltip, status badge, idempotency helper và dialog ngừng; không tạo bản sao.

## 3. TDD và error UX

- Schema từ chối tên rỗng, serviceTypes rỗng, phone/email sai, thiếu location khi tạo.
- `REFERENCE_NOT_FOUND`: lỗi ngay field location + tải lại options.
- `RECORD_VERSION_CONFLICT`: màn báo tải lại, không ghi đè.
- `CATALOG_ITEM_IN_USE`: dialog ngừng giữ mở, trình bày số liệu backend trả khi dependency đã có.
- Full test/build + Impeccable detector + finish review. Không dùng GSAP cho màn thao tác dữ liệu; motion chỉ là state transition sẵn có.
