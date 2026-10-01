# Wireframe — UC-IAM-05: Thêm nhân viên

## Hướng thiết kế

Giao diện quản trị mật độ vừa, dùng design system hiện có. Trọng tâm là an toàn khi nhập hồ sơ dài: luôn biết đang ở bước nào, còn thiếu gì và lệnh cuối tạo những gì. Không thêm card trang trí, gradient hay chuyển động phô diễn.

## Desktop (≥ 1024 px)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Nhân viên / Thêm nhân viên                                               │
│ Thêm nhân viên                                      [Hủy]                │
│ Nhập theo 4 bước. Dữ liệu chỉ lưu khi bấm Tạo tài khoản.                │
├──────────────────────────────────────────────────────────────────────────┤
│  ① Đơn vị công tác ── ② Cá nhân ── ③ Công việc ── ④ Tài khoản           │
├────────────────────────────────────────────┬─────────────────────────────┤
│ Nội dung bước (max 720 px)                 │ Tóm tắt nhanh               │
│ [Label *]                                  │ Location  Chưa chọn         │
│ [Input / Select.........................]  │ Nhân viên Chưa nhập         │
│ [Trợ giúp hoặc lỗi theo ô]                 │ Vai trò   Chưa gán          │
│                                            │                             │
│ [Quay lại]                    [Tiếp tục]   │ Chưa gán vai trò: chưa xem │
│                                            │ được dữ liệu location nào. │
└────────────────────────────────────────────┴─────────────────────────────┘
```

- Cột chính 2/3, summary rail 1/3; rail sticky nhưng không che footer form.
- Tối đa hai cột field; email, họ tên và location chiếm cả hàng.
- Bước 4 biến rail thành “Sẵn sàng tạo”, liệt kê bốn nhóm và nút `Sửa` có accessible name rõ nhóm.

## Mobile (< 768 px)

```text
┌────────────────────────────┐
│ ← Nhân viên                │
│ Thêm nhân viên             │
│ Bước 2/4 · Thông tin cá nhân│
│ ●━━━━●────○────○           │
├────────────────────────────┤
│ [Label *]                  │
│ [Input...................] │
│ [Lỗi / trợ giúp]           │
│                            │
│ [Quay lại] [Tiếp tục     ] │
└────────────────────────────┘
```

- Ẩn nhãn dài của bước chưa hiện, giữ “Bước n/4 + tên bước”.
- Summary rail thành accordion “Xem thông tin đã nhập” trên action bar.
- Action bar không fixed để tránh che bàn phím; nút chính rộng hơn.

## Field và trạng thái

1. **Đơn vị công tác:** location; department chỉ mount khi location `OFFICE`, đổi location xoá department.
2. **Thông tin cá nhân:** họ tên, email, phone common numeric, ngôn ngữ.
3. **Chi tiết công việc:** mã, chức danh, loại hình, ngày vào làm, cấp trên; đều tuỳ chọn.
4. **Tài khoản và vai trò:** radio mời email/mật khẩu tạm; role có “Chưa gán”; có role mới hiện hiệu lực và reason; review đặt trong trang.

- Không có location: nói rõ cần tạo location hoạt động trước, có link về danh mục.
- Lỗi gửi email: hồ sơ đã tạo nhưng thư chưa gửi; không khuyến khích tạo lại.
- Mật khẩu tạm: dialog chỉ hiện một lần, nút sao chép có live region.

## Accessibility và tương tác

- Tab theo DOM; không click bước chưa hoàn tất, bước hoàn tất được quay lại.
- Focus heading khi đổi bước; focus field đầu tiên khi validation lỗi.
- Màu không là tín hiệu duy nhất; touch target ≥44 px; cursor chỉ đổi với phần tử tương tác.
- Tôn trọng `prefers-reduced-motion`; không dùng GSAP cho flow này.
