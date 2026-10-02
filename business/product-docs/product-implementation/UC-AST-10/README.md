# UC-AST-10 — Duyệt huỷ hồ sơ tạo sai (kế hoạch frontend)

> Checker của cặp maker-checker. Một Quản lý tài sản KHÁC người đề nghị duyệt hoặc từ chối đề nghị ở
> Chờ duyệt (UC-AST-09). Duyệt → hồ sơ sang Hủy (giữ Asset ID, vẫn trong lịch sử). Backend đã xong
> (RPC `decide_asset_cancellation`, khoá lạc quan theo `version`).

## 1. Màn hình và điều hướng

- **Trang hàng đợi duyệt** `/_authenticated/asset-cancellations` + mục sidebar `nav.cancellationQueue`.
  - ⚠️ GĐ1 CHƯA có module Hộp việc (HO-24) và chưa có màn hình duyệt riêng ở Phụ lục K ([TBD-5] của UC).
    Theo kế hoạch backend, GĐ1 thay Hộp việc bằng **trang hàng đợi** này (danh sách đề nghị Chờ duyệt).
    Thông báo kết quả cho người đề nghị HOÃN tới khi có module thông báo.
- Mỗi dòng có nút **Từ chối** (outline) và **Duyệt huỷ** (destructive) → mở
  `AssetCancellationDecisionDialog` theo `mode` tương ứng.

## 2. API và trạng thái

- `assetCancellationsListQueryOptions('PENDING')` → `GET /asset-cancellations?status=PENDING&pageSize=100`.
  Quyền: platform `ASSET_MANAGER` (server thực thi).
- `cancellationRejectOptionsQuery()` → `GET /asset-cancellations/reject-options` (nhóm `APPROVAL_REJECT`);
  chỉ nạp khi `mode==='REJECT'` (`enabled`).
- `decideAssetCancellation(id, { decision, reasonCodeId?, reasonNote?, expectedVersion }, commandKey)` →
  `POST /asset-cancellations/:id/decision`. `expectedVersion = request.version` (khoá lạc quan chống hai
  người duyệt cùng lúc — EX.3). `Idempotency-Key` sinh một lần cho mỗi lần mở dialog.
- Sau quyết định: `invalidate(['asset-cancellations'])` + `invalidate(assetKeys.all)`, đóng dialog.

## 3. Nội dung và validation

- **Duyệt:** không nhập lý do (nhật ký lấy lý do của ĐỀ NGHỊ — giả định 3 của UC). Nút `destructive`.
- **Từ chối:** bắt buộc lý do (nhóm `APPROVAL_REJECT`) qua `SelectDropdown` trong `<FormField>`; mục
  freetext bắt ghi chú (schema dùng chung với UC-AST-09).
- Ánh xạ lỗi theo `error.code`:
  - `SELF_APPROVAL_FORBIDDEN` (EX.1) → lỗi tổng "Cần một Quản lý tài sản khác người đề nghị duyệt."
  - `REASON_INVALID` → lỗi tại trường lý do.
  - `CANCELLATION_ALREADY_DECIDED` (EX.3), `RECORD_VERSION_CONFLICT`, `ASSET_STATUS_LOCKED` (EX.2),
    thiếu quyền (EX.4) → lỗi tổng với câu dịch của mã.
- Dòng tóm tắt đề nghị (người đề nghị + lý do) hiện trong dialog để người duyệt đối chiếu trước khi quyết định.

## 4. A11y, responsive và test

- Trang bọc `Header` + `Main` + `PageHeader`; bảng `min-w-[880px]` trong vùng `overflow-x-auto` (cuộn ngang
  trên hẹp, không vỡ trang); mã tài sản dùng `CodeText`; `TableCaption` `sr-only`.
- Trạng thái: skeleton `aria-busy` khi tải; `EmptyState` + nút Thử lại khi lỗi; `EmptyState` + gợi ý khi rỗng.
- Dialog: `aria-busy` khi pending; `items-start`; lý do/ghi chú theo `FormField`.
- Test: `asset-cancellation-schema.test.ts` + smoke render trang hàng đợi (rỗng → EmptyState) và dialog
  duyệt/từ chối (mở không crash).
