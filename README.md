# EVERY HALF · Asset Management — Frontend (`eh_am_frontend`)

Web cho hệ thống quản lý tài sản & công cụ dụng cụ (CCDC) của chuỗi Every Half, dùng ở văn phòng (kế toán, quản lý tài sản) và ở cửa hàng / kho / xưởng rang. Đây là bản demo cho bài test năng lực vị trí **product builder**: README này tập trung vào **cách tôi đi từ use case sang giao diện — vẽ wireframe và layout trước, rồi mới dựng tính năng**.

- **Bản demo:** <https://am.wecoloresoft.com>
- **Ngăn xếp:** React 19 · Vite · TypeScript · TanStack Router / Query / Table · Tailwind CSS 4 · shadcn/ui · Zustand · Zod 4 · i18next · Vitest (browser mode).
- **Backend:** [`eh_am_backend`](../eh_am_backend) — API `/v1`, cổng 3006.
- **Chạy máy, biến môi trường, bảo mật, cấu trúc, quy ước:** xem [`DEVELOPMENT.md`](DEVELOPMENT.md).

Bộ use case nguồn nằm ở repo backend: [`../eh_am_backend/business/product-docs/product-usecase/`](../eh_am_backend/business/product-docs/product-usecase/). Frontend nhận use case đã chốt rồi lo phần nhìn và phần tương tác.

---

## Cách đi từ use case sang màn hình

Nguyên tắc xuyên suốt: **chốt bố cục trước khi code**. Mỗi use case có một thư mục kế hoạch ở [`business/product-docs/product-implementation/<Mã UC>/`](business/product-docs/product-implementation/) gồm hai file bắt buộc:

- `DESIGN-README.md` — wireframe dạng ASCII cho từng page / dialog / form của UC, kèm token dùng, các trạng thái (tải / rỗng / lỗi / xung đột phiên), responsive và a11y. Viết **trước** khi dựng màn hình.
- `README.md` — kế hoạch kỹ thuật frontend: luồng màn hình, component, gọi API nào, trạng thái ra sao.

Nhờ tách bước thiết kế khỏi bước code, khi bắt tay viết React thì bố cục, trạng thái và a11y đã quyết xong; bước dev chỉ còn dựng theo bản đã chốt.

### Nền thiết kế dùng lại cho mọi màn hình

Thương hiệu, token màu/chữ, design system và component dùng chung nằm ở [`business/product-docs/product-design/`](business/product-docs/product-design/), đọc theo thứ tự: nhận diện thương hiệu → design token → design system → common component. Token thật đổ vào `src/styles/theme.css`. Mọi màn hình mới kế thừa bộ này thay vì tự chế màu/chữ.

---

## Skill / plugin dùng cho phần frontend

| Bước                  | Skill / agent (plugin)                                    | Để làm gì                                                                         |
| --------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Nhận diện thương hiệu | `chrome-devtools` (MCP của `ecc`) + `WebFetch`            | Trích màu, font, phong cách thật từ trang Every Half; chụp màn hình tham chiếu    |
| Thiết kế giao diện    | `frontend-design` (example-skills)                        | Trục chính về token, component, phong cách; tránh mẫu generic                     |
| Hệ thống thiết kế     | `ui-ux-pro-max:design-system`, `ui-ux-pro-max:ui-styling` | Khung design system và quy ước style                                              |
| Thẩm mỹ / thương hiệu | `taste-skill` (taste, brandkit)                           | Giữ gu biên tập, đơn sắc ấm                                                       |
| Kế hoạch kỹ thuật FE  | `ecc:plan`                                                | Mô tả tính năng FE, luồng màn hình, component, API cho từng UC                    |
| Viết code theo TDD    | dev flow `ecc` + `superpowers:test-driven-development`    | Vitest chạy trong trình duyệt thật (Chromium); RED → GREEN                        |
| Review                | `ecc:react-reviewer`, `ecc:typescript-reviewer`           | Rà hook, render, ranh giới component, kiểu, bảo mật phía client                   |
| Kiểm hình ảnh         | `chrome-devtools` (screenshot ở cổng 5175)                | Soát render thật ở light / dark / mobile trước khi bàn giao test                  |
| Soát văn chữ hiển thị | `humanizer:humanizer`                                     | Nhãn, thông báo, câu lỗi, trạng thái rỗng viết ở góc độ người dùng, không văn máy |

Màn đăng nhập là "khoảnh khắc thương hiệu" nên có dùng `gsap-skills` (GSAP + @gsap/react) cho animation hai cột; các màn làm việc dày dữ liệu thì tiết chế chuyển động (`tw-animate-css`), và luôn tôn trọng `prefers-reduced-motion`.

---

## Tài liệu ở đâu

| Nội dung                                     | Vị trí                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Use case (nguồn yêu cầu)                     | [`../eh_am_backend/business/product-docs/product-usecase/`](../eh_am_backend/business/product-docs/product-usecase/)                     |
| Thương hiệu, token, design system, component | [`business/product-docs/product-design/`](business/product-docs/product-design/)                                                         |
| Kế hoạch FE + wireframe từng UC              | [`business/product-docs/product-implementation/<UC>/`](business/product-docs/product-implementation/) — `README.md` + `DESIGN-README.md` |
| Master Blueprint, use case, kế hoạch BE      | repo backend [`../eh_am_backend`](../eh_am_backend) (xem README của nó)                                                                  |
| Chuẩn UI bắt buộc, kiến trúc, bảo mật, lệnh  | [`CLAUDE.md`](CLAUDE.md) và [`DEVELOPMENT.md`](DEVELOPMENT.md)                                                                           |

Tài liệu viết tiếng Việt (thuật ngữ kỹ thuật thông dụng như API, QR, URL giữ tiếng Anh); code viết tiếng Anh, comment tiếng Việt.

---

## Trạng thái bản demo

| Việc                                                                                                                           | Trạng thái                |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| Khung ứng dụng: router file-based, React Query, layout, sidebar, bảng lệnh, theme sáng/tối                                     | ✅ Dựng xong              |
| Gọi API + làm mới phiên (một lời gọi refresh duy nhất) + chuẩn hoá lỗi `ApiError`                                              | ✅ Dựng xong              |
| Auth: đăng nhập · quên / đặt lại / đổi mật khẩu · đăng xuất một nơi / mọi thiết bị · `/me`                                     | ✅ Dựng xong              |
| Đa ngôn ngữ vi/en · trang lỗi 401/403/404/500/503 · CSP · chống open redirect                                                  | ✅ Dựng xong              |
| Màn hình M03 — Hồ sơ tài sản: danh sách · chi tiết · tạo · sửa · đổi người giữ · đổi vòng đời · chứng từ · đề nghị + duyệt huỷ | ✅ Dựng xong (bản demo)   |
| Các module nghiệp vụ còn lại                                                                                                   | ⏸️ Ngoài phạm vi bản demo |

Founder đã nói rõ: chỉ cần demo để thấy logic và cách làm, chưa cần xây đủ tính năng thực tế. Phần hướng dẫn chạy máy và chi tiết kỹ thuật ở [`DEVELOPMENT.md`](DEVELOPMENT.md).
