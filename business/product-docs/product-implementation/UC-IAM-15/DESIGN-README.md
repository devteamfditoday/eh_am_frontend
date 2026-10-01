# Wireframe — UC-IAM-15: Danh sách nhân viên

## Hướng thiết kế

Công cụ quản trị nội bộ, không phải trang thương hiệu: **nhất quán với design system hiện có** (các trang master-data) là lựa chọn đúng, không sáng tạo palette riêng. Trọng tâm (hero) là **thanh tìm/lọc + bảng** — nơi người dùng làm việc — chứ không phải card trang trí hay số liệu lớn. Một điểm nhấn duy nhất: cột trạng thái tài khoản dùng badge có màu + chữ để quét nhanh ai đang Chờ kích hoạt.

- **Token:** dùng token design system sẵn có (`--background`, `--foreground`, `--muted-foreground`, `--border`, `--primary`, `--destructive`). Badge: ACTIVE = nền success nhạt; PENDING = amber nhạt; SUSPENDED = xám; DEACTIVATED = viền mờ. Màu không là tín hiệu duy nhất — luôn kèm nhãn.
- **Type:** một họ chữ của hệ thống; tên nhân viên `font-medium`, mã nhân viên dòng phụ `text-xs text-muted-foreground`. Không in hoa toàn bộ nhãn.
- **Layout:** `Header` (tiêu đề + nút Thêm nhân viên) → thanh lọc → bảng → phân trang. Căn trái; bảng tràn chiều ngang cuộn trong khung trên mobile.
- **Nguyên tắc:** mật độ vừa, mỗi dòng là một người quét được trong một liếc; không chuyển động phô diễn (bảng nghiệp vụ cần phản hồi tức thì), tôn trọng `prefers-reduced-motion`.

## Desktop (≥ 1024 px)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Nhân viên                                                 [ + Thêm nhân viên ]│
│ Tra cứu và quản lý tài khoản nhân viên.                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Tìm tên, email, mã nhân viên............]  Tổng: 128 nhân viên            │
│ [Địa điểm ▾] [Phòng ban ▾] [Vai trò ▾] [Trạng thái ▾] [Loại hình ▾] [Xoá lọc]│
├──────────────┬───────────────────┬──────────┬─────────┬───────────┬──────────┤
│ Họ tên       │ Email             │ Địa điểm │ Phòng ban│ Trạng thái │ Vào làm │
├──────────────┼───────────────────┼──────────┼─────────┼───────────┼──────────┤
│ Nguyễn Văn A │ a@everyhalf.vn    │ CH Quận1 │ —        │ ●Đã kích hoạt│ 01/09/26│
│  NV0012      │                   │          │          │           │          │
│ Trần Thị B   │ b@everyhalf.vn    │ Văn phòng│ Kế toán │ ●Chờ kích hoạt│ 15/09/26│
│  NV0020      │                   │          │          │  Lời mời: Hết hạn → [Gửi lại]│
│ ...                                                                           │
├────────────────────────────────────────────────────────────────────────────┤
│                                   ‹ Trước   Trang 1/7   Sau ›   20/trang ▾    │
└────────────────────────────────────────────────────────────────────────────┘
```

- Dòng Chờ kích hoạt hiện thêm "Lời mời: Đã gửi / Hết hạn"; nút **[Gửi lại]** chỉ là **chỗ đặt** (hành vi ở UC-IAM-07) — ở UC này có thể disabled kèm tooltip "Sẽ bật ở UC-IAM-07" hoặc ẩn, tuỳ chốt khi code UC-IAM-07.
- Click vào ô Họ tên/dòng → mở hồ sơ (`/employees/$id`, UC-IAM-14).
- Email và điện thoại chỉ hiển thị ở trang quản trị này.

## Mobile (< 768 px)

```text
┌────────────────────────────┐
│ Nhân viên      [+ Thêm]     │
│ [🔍 Tìm.................]    │
│ [Bộ lọc ▾ (3)]   Tổng: 128  │
├────────────────────────────┤
│ Nguyễn Văn A · NV0012       │
│ a@everyhalf.vn              │
│ CH Quận 1 · —               │
│ ●Đã kích hoạt · Vào 01/09   │
├────────────────────────────┤
│ Trần Thị B · NV0020         │
│ b@everyhalf.vn              │
│ Văn phòng · Kế toán         │
│ ●Chờ kích hoạt              │
│ Lời mời: Hết hạn  [Gửi lại] │
└────────────────────────────┘
     ‹ Trước  1/7  Sau ›
```

- Dưới 768 px bảng chuyển thành **danh sách thẻ** (mỗi người một thẻ), tránh cuộn ngang khó dùng.
- Bộ lọc gom vào một nút "Bộ lọc" mở sheet/popover; badge số bộ lọc đang bật.

## Trạng thái

- **Tải:** skeleton các dòng + `aria-busy="true"`; giữ thanh lọc thao tác được.
- **Rỗng (EX.1):** "Không có nhân viên khớp bộ lọc." + gợi ý "Thử bỏ bớt bộ lọc"; không phải lỗi; giữ nguyên từ khoá/bộ lọc để sửa.
- **Lỗi / timeout (EX.5):** `role="alert"` + nút "Tải lại"; **không** hiện bảng trống như thể không có ai.
- **429 (EX.4):** giữ kết quả lần trước, báo "Thao tác quá nhanh, thử lại sau N giây".
- **Không có quyền (EX.2):** route không hiện với người không phải SYSTEM_ADMIN; nếu API trả 403 thì hiện thông báo thiếu quyền.

## Accessibility và tương tác

- Bảng có `aria-label`/`caption`; thứ tự tab theo DOM; dòng mở hồ sơ bằng Enter.
- Badge trạng thái: màu + chữ (không chỉ màu); contrast đạt chuẩn.
- Ô tìm có nhãn ẩn; debounce 300 ms không làm mất ký tự đang gõ.
- Touch target ≥ 44 px cho nút lọc, phân trang, nút Thêm.
- Tôn trọng `prefers-reduced-motion`; không GSAP cho bảng.
