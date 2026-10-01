# DESIGN — UC-MDM-06: Danh mục đơn vị sửa chữa

> Mode `Operate`. Giữ hệ “mực trên giấy” của EH-AM, mật độ vừa-cao, ưu tiên nhận ra đơn vị và location đích. Dials: variance 3, motion 1, density 7.

## 1. Trang danh sách

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Đơn vị sửa chữa                         [ + Thêm đơn vị sửa chữa ]       │
│ Đối tác nhận tài sản để sửa chữa hoặc bảo hành.                          │
├──────────────────────────────────────────────────────────────────────────┤
│ [ Tìm tên, location hoặc liên hệ… ] [ Trạng thái ▾ ]          [ Cột ▾ ] │
├────────────────────┬─────────────────┬────────────────┬───────────┬──────┤
│ ĐƠN VỊ             │ DỊCH VỤ         │ LOCATION ĐÍCH  │ LIÊN HỆ   │ TT   │
│ Điện máy Minh Tâm  │ Sửa · Bảo hành  │ EXT-MINHTAM    │ Anh Minh  │ ● HĐ │
│                    │                 │ ↳ Minh Tâm Q7  │ 090…      │      │
└────────────────────┴─────────────────┴────────────────┴───────────┴──────┘
```

- Location hiển thị `CodeText`; tên ở dòng phụ/tooltip. Không hiển thị UUID.
- Dịch vụ dùng hai badge chữ trung tính, không phụ thuộc màu. Dòng ngừng mờ vừa phải, thao tác disabled đúng cursor.
- Desktop cuộn ngang từ `min-width`; mobile không ép chữ/cột thành các thẻ khó quét.

## 2. Dialog thêm/sửa

```text
┌──────────────────────────────────────────────────────────┐
│ Thêm đơn vị sửa chữa                                 [x] │
│ Chọn location bên ngoài sẽ dùng làm điểm gửi tài sản.    │
├──────────────────────────────────────────────────────────┤
│ Tên đơn vị * [                                         ] │
│ Dịch vụ *    [✓ Sửa chữa] [□ Bảo hành]                   │
│ Location *   [ EXT-MINHTAM — Minh Tâm Quận 7          ▾] │
│               Chưa có location? [Mở Danh mục location]   │
│ ───────────────── Thông tin liên hệ ──────────────────── │
│ Người liên hệ [                 ] Số điện thoại [       ] │
│ Email         [                                      ]   │
│                                      [Huỷ] [Lưu]         │
└──────────────────────────────────────────────────────────┘
```

- Mode sửa: location là khối read-only có mã + tên, không phải select disabled mơ hồ.
- Dịch vụ là checkbox/toggle có label thật, focus ring và vùng chạm ≥44px; cho chọn cả hai.
- Phone dùng `NumericInput`; chữ bị loại khi gõ/dán, dấu cách chỉ là lớp hiển thị.
- Mobile: một cột, footer nút rõ thứ tự, mọi control ≥44px.

## 3. Ngừng và trạng thái

Copy xác nhận: “Đơn vị và location bên ngoài này sẽ cùng ngừng hoạt động. Hãy hoàn tất việc nhận tài sản về và các phiếu đang mở trước.” Không dùng câu kỹ thuật hoặc mã lỗi làm nội dung chính.

Loading có `aria-busy`; empty/error có hành động; tooltip mở bằng hover và keyboard focus; label/error nối bằng semantics của shadcn Form. Nội dung vi/en được viết tự nhiên theo Humanizer. Không animation trang trí, gradient, glass hoặc layout marketing.
