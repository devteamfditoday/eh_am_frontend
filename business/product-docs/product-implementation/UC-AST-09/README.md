# UC-AST-09 — Đề nghị huỷ hồ sơ tạo sai (kế hoạch frontend)

> Maker của cặp maker-checker. Quản lý tài sản / Kế toán tài sản gửi đề nghị huỷ một hồ sơ tạo
> nhầm hoặc trùng, kèm lý do. Hồ sơ KHÔNG bị xoá, chưa đổi trạng thái; một Quản lý tài sản khác
> duyệt ở UC-AST-10. Backend đã xong (migration 21, RPC `request_asset_cancellation`).

## 1. Màn hình và điều hướng

- Không có route riêng: thao tác nằm ở trang **Chi tiết tài sản** (`/assets/$assetId`).
- Nút **Đề nghị huỷ hồ sơ** (`variant='destructive'`) chỉ hiện khi: người dùng có vai trò
  `ASSET_MANAGER` hoặc `ASSET_ACCOUNTANT` **và** `asset.readOnly === false`. Gating chỉ để ẩn/hiện
  UI; máy chủ mới là nơi thực thi quyền.
- Bấm nút mở `AssetCancellationRequestDialog` (dialog, không điều hướng).

## 2. API và trạng thái

- `assetCancellationOptionsQuery(id)` → `GET /assets/:id/cancellation-options` (danh mục lý do nhóm
  `ASSET_CANCEL`). Dialog chỉ nạp khi `open`.
- `requestAssetCancellation(id, { reasonCodeId, reasonNote? }, commandKey)` →
  `POST /assets/:id/cancellation-request`. `Idempotency-Key` sinh một lần cho mỗi lần mở dialog
  (`createIdempotencyKey`) nên gửi lại khi mất mạng không tạo đề nghị trùng (EX.7).
- Thành công: toast, `invalidateQueries(assetKeys.all)` (để trang chi tiết/danh sách cập nhật), đóng dialog.
- Trạng thái dialog: `isPending` → skeleton `aria-busy`; lỗi nạp danh mục → thông báo + nút Đóng.

## 3. Nội dung và validation

- Lý do chọn từ `SelectDropdown` (đặt TRONG `<FormField>` của react-hook-form — bắt buộc, vì
  `SelectDropdown` bọc `<FormControl>`; dùng ngoài form sẽ crash `useFormField`).
- Ghi chú lý do **bắt buộc** khi chọn mục freetext ("Khác"): schema `createCancellationReasonSchema`
  dùng `superRefine` theo tập `freeTextReasonIds`; `<RequiredMark/>` hiện có điều kiện (EX.2).
- Ánh xạ lỗi nghiệp vụ từ backend (branch theo `error.code`, không theo message):
  - `REASON_INVALID` → lỗi tại trường lý do.
  - còn lại (`CANCELLATION_PENDING_EXISTS` EX.3, `NO_APPROVER_AVAILABLE` EX.5, `ASSET_STATUS_LOCKED`
    EX.1, `ASSET_READ_ONLY`, thiếu quyền EX.4) → lỗi tổng (`root`) với câu dịch của mã đó.
- Mọi chuỗi qua i18n `assets.cancellation.*` (vi là nguồn, en khớp khoá).

## 4. A11y, responsive và test

- Nút submit `variant='destructive'`, `aria-busy={isPending}`, spinner khi gửi; dialog `sm:max-w-xl`,
  `grid gap-5`, `items-start` để lỗi field không đẩy lệch hàng.
- Textarea `maxLength={500}`; label liên kết qua `FormField`/`FormLabel`.
- Test: `asset-cancellation-schema.test.ts` (bắt buộc lý do, freetext bắt ghi chú, giới hạn 500) +
  smoke render dialog (mở không crash, có ô chọn lý do).
