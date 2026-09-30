# Design system EH-AM

> **Yêu cầu 1 — phần hệ thống.** Quy ước kiểu chữ, khoảng cách, mật độ, bố cục, chuyển động, responsive, PWA và accessibility cho toàn ứng dụng. Đi cùng [10-design-tokens.md](10-design-tokens.md) (token) và [30-common-components.md](30-common-components.md) (component).

## 1. Tinh thần

EH-AM là công cụ nội bộ dày dữ liệu, không phải trang marketing. Kế thừa tinh thần Every Half (đơn sắc ấm, tối giản, biên tập, chính xác) nhưng đặt **dữ liệu và tốc độ đọc lên trên trang trí**. Nguyên tắc theo skill frontend-design: dồn "độ táo bạo" vào một chỗ (khoảnh khắc thương hiệu ở đăng nhập, trạng thái rỗng), còn màn làm việc thì yên tĩnh, kỷ luật.

## 2. Kiểu chữ và thang cỡ

- **Tiêu đề (Bricolage Grotesque):** tiêu đề trang `text-2xl font-semibold tracking-tight`; tiêu đề mục/thẻ `text-lg font-semibold`. Dùng `font-bricolage`.
- **Thân (Inter):** nội dung `text-sm` (14px) là cỡ chuẩn cho UI dày dữ liệu; phụ đề/ghi chú `text-xs text-muted-foreground`; đoạn văn dài `max-w-prose` (< 80 ký tự/dòng).
- **Mono (SUSE Mono):** mã và số kỹ thuật, `font-mono`, có thể `tabular-nums` để canh cột số.
- **Không** lạm dụng in hoa toàn phần; nhãn mono in hoa chỉ dùng ở eyebrow/nhãn kỹ thuật, không dùng cho nội dung.
- Số tiền/nguyên giá: `tabular-nums`, canh phải trong bảng.

## 3. Khoảng cách và mật độ

- Đơn vị 4px (thang Tailwind). Khoảng cách trong form/thẻ: `gap-3`/`gap-4`; giữa các mục lớn: `gap-6`/`space-y-6`.
- Lề trang: `px-4` (mobile) → `px-6` (desktop); nội dung tối đa `max-w-7xl` cho bảng rộng, hẹp hơn cho form.
- Mật độ bảng: hàng cao vừa (`h-10`–`h-11`), padding ô `px-3`. Ưu tiên hiện nhiều dòng hơn là thoáng quá mức.

## 4. Bố cục (Lark + chuẩn quản trị)

App shell đã có: **sidebar trái** (điều hướng theo module, thu gọn được, mobile là Sheet) + **header mỏng** (tìm kiếm lệnh, chọn location đang xem, thông báo, hồ sơ, ngôn ngữ) + **vùng nội dung**.

Ba khuôn màn hình chuẩn:

1. **Danh sách** (mọi module): `PageHeader` + thanh lọc (data-table toolbar, faceted filter) + bảng dữ liệu (URL-synced) + phân trang. Rỗng → `EmptyState`.
2. **Chi tiết** (tài sản, phiếu, nhân viên): `PageHeader` (kèm `StatusBadge`) + bố cục hai cột: cột chính (`DescriptionList`, tab thông tin/lịch sử) + cột phụ (meta, audit, hành động). Mobile xếp dọc.
3. **Form tạo/sửa / wizard** (tạo tài sản, tạo tài khoản nhân viên nhiều bước): thẻ form một cột hẹp, nhóm trường theo mục, nút chính bên phải, xác nhận rời trang khi có thay đổi.

Căn lề: nội dung căn trái (đọc quét dọc nhanh); số căn phải; tiêu đề căn trái.

## 5. Màu và trạng thái

- Primary (mực) chỉ cho **một** hành động chính mỗi khu vực; hành động phụ dùng `outline`/`ghost`.
- Trạng thái nghiệp vụ luôn qua `StatusBadge` với `tone` ngữ nghĩa, kèm nhãn chữ (không chỉ màu).
- Không dùng màu để trang trí; màu mang thông tin.

## 6. Chuyển động

- Kiềm chế. Chuyển tiếp 150–250ms ease-out cho hover, mở/đóng, focus. Dùng `tw-animate-css` và transition của Radix có sẵn.
- Chuyển động do người dùng kích hoạt (mở dialog, mở rộng hàng, xác nhận) được khuyến khích vì cho biết cái gì vừa đổi.
- **Không** hiệu ứng tự chạy rải rác (fade-slide mọi section, hover nảy mọi thẻ). **Không** thêm thư viện animation nặng (GSAP) cho công cụ này.
- Tôn trọng `prefers-reduced-motion`: tắt chuyển tiếp không thiết yếu.

## 7. Responsive và mobile

- Breakpoint Tailwind: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
- Mobile-first: mọi màn phải dùng được ở bề ngang điện thoại, không cuộn ngang trang (chỉ cuộn ngang trong bảng khi cần).
- Sidebar → Sheet trên `< lg`. Bảng dày cột → ưu tiên cột quan trọng, ẩn/gộp cột phụ hoặc cho cuộn ngang trong khung bảng.
- Vùng chạm tối thiểu 40–44px; input trên mobile `font-size: 16px` (đã set trong `index.css` để tránh iOS zoom).

## 8. PWA

- Đã thêm `public/manifest.webmanifest` (name, short_name `EH-AM`, `display: standalone`, `theme_color` giấy kem, icon) và `<link rel="manifest">` + meta apple + `theme-color` theo light/dark trong `index.html`. App cài được như ứng dụng.
- **Việc còn lại để PWA offline đầy đủ (đề xuất, chưa làm để tránh rủi ro khi chưa được duyệt thêm dependency):**
  1. Thêm service worker (khuyến nghị `vite-plugin-pwa` + Workbox) để cache app shell và font; app tài sản nội bộ chủ yếu cần shell chạy được khi mạng chập chờn, còn dữ liệu vẫn gọi API.
  2. Tự host font woff2 trong `public/fonts/` + `@font-face` cục bộ thay `<link>` Google Fonts, để offline thật và siết CSP (`font-src 'self'`), tránh phụ thuộc miền ngoài. Khi làm cần cập nhật CSP trong `vite.config.ts`.
  3. Bổ sung icon PWA đúng kích thước (192, 512, maskable) khi có bộ nhận diện chính thức của Every Half.
- Ba việc trên ghi lại ở đây để không quên; làm khi Duy duyệt thêm dependency.

## 9. Accessibility

- Ngữ nghĩa HTML đúng (`<h1>` một lần mỗi trang qua `PageHeader`, `<dl>` cho chi tiết, `<button>`/`<a>` đúng vai trò).
- Focus bàn phím thấy rõ (ring). Thứ tự tab hợp lý. `skip-to-main` đã có.
- Nhãn cho control không chữ (nút icon có `aria-label`, ví dụ nút chép trong `CodeText`).
- Không truyền thông tin chỉ bằng màu.
- Tôn trọng `prefers-reduced-motion` và `prefers-color-scheme`.

## 10. Kiểm thử hình ảnh

Sau khi đổi token/component, chạy `npm run dev` (cổng 5175) và chụp màn hình thật để soát (skill frontend-design: "một ảnh đáng giá 1000 token"). Kiểm ở cả light/dark và bề ngang mobile. Không kết luận "đẹp" chỉ vì typecheck xanh.

## 11. Việc không làm (tránh over-engineering)

Theo dặn dò của Duy: không nhồi skill/thư viện. Cụ thể không thêm GSAP, không sản xuất asset marketing, không dựng trước component cho màn chưa có. Component cụ thể của từng UC dựng ở Yêu cầu 2 khi làm UC đó.

## 12. Cập nhật: GSAP cho khoảnh khắc thương hiệu (login)

Điều chỉnh so với §6/§11: theo yêu cầu của Duy, **màn đăng nhập** dùng animation phong phú kiểu Larksuite (bố cục hai cột, panel thương hiệu bên phải). Đã thêm **GSAP + @gsap/react** và dùng ở `src/features/auth/brand-panel.tsx`:

- Timeline entrance có stagger, vòng lặp trôi cho hoạ tiết, quầng sáng dịch chuyển, parallax theo con trỏ.
- Dùng `useGSAP` với `scope` ref, `contextSafe` cho handler pointer, `gsap.matchMedia` để **tôn trọng `prefers-reduced-motion`** (tắt thì chỉ hiện bố cục tĩnh).

Ranh giới giữ nguyên: GSAP **chỉ** dùng cho khoảnh khắc thương hiệu (login, và về sau có thể là trạng thái rỗng/landing nội bộ). Các **màn làm việc dày dữ liệu** (bảng, form, chi tiết) vẫn tiết chế, chỉ dùng `tw-animate-css` + transition của Radix, không nhồi GSAP. Bố cục login: `auth-layout.tsx` (hai cột, panel `hidden lg:block` để mobile chỉ còn form).
