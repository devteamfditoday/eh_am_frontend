# UC-AST-11 — Đưa vào / ngừng sử dụng tài sản (kế hoạch kỹ thuật frontend)

> Thao tác đổi trạng thái vòng đời Lưu kho ↔ Đang sử dụng trên trang chi tiết. Khuôn theo UC-AST-05.

## 1. Thành phần

- `src/lib/api/assets.api.ts`: `getAssetLifecycleOptions(id)` → `{ currentStatus, profileVersion, reasons }`;
  `changeAssetLifecycle(id, payload, commandKey)` (PATCH `/assets/:id/lifecycle`).
- `src/lib/api/assets.queries.ts`: `assetLifecycleOptionsQuery(id)` + `assetKeys.lifecycleOptions`.
- `src/features/assets/detail/asset-lifecycle-schema.ts`: zod (reasonCodeId uuid + reasonNote; freetext
  → bắt ghi chú).
- `src/features/assets/detail/asset-lifecycle-dialog.tsx`: dialog xác nhận (hiện trạng thái hiện tại →
  đích, chọn lý do, ghi chú, xử lý 409 version conflict + REASON_INVALID + ASSET_STATUS_LOCKED).
- `asset-detail-page.tsx`: nút "Đưa vào sử dụng"/"Ngừng sử dụng" (nhãn theo trạng thái), gating vai trò +
  trạng thái; mở dialog.
- i18n `assets.lifecycle.*` (vi + en).

## 2. Phân quyền hiển thị

- Nút chỉ hiện khi `hasAnyRole(user, [ASSET_MANAGER, LOCATION_MANAGER])`, `!readOnly`, và
  `lifecycleStatus in {IN_STORAGE, IN_USE}`. Server vẫn là nguồn chân lý (403/404/409 xử lý ở dialog).

## 3. Trạng thái

| Trạng thái | Xử lý |
| --- | --- |
| Tải options | Skeleton `aria-busy` |
| Lỗi options | alert + nút Hủy |
| 409 version conflict (EX.4) | thông báo + "Tải lại hồ sơ" (invalidate detail) |
| REASON_INVALID (EX.3) | lỗi cạnh ô lý do |
| ASSET_STATUS_LOCKED / ASSET_READ_ONLY | alert chung (trạng thái đã đổi) + nhắc tải lại |
| Thành công | toast + invalidate `assetKeys.all`, đóng dialog |

## 4. Test

- `asset-lifecycle-schema.test.ts`: reasonCodeId sai UUID → lỗi; mục freetext thiếu ghi chú → lỗi;
  hợp lệ → pass.
