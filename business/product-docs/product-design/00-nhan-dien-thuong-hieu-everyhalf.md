# Nhận diện thương hiệu Every Half và ánh xạ vào EH-AM

> **Yêu cầu 0.** Tài liệu này rút bộ nhận diện thương hiệu từ `https://www.everyhalf.vn/` (trích trực tiếp bằng công cụ trình duyệt ngày 30/09/2026) và ánh xạ sang hệ thống thiết kế cho ứng dụng nội bộ EH-AM (quản lý tài sản & CCDC). Đây là đầu vào cho Yêu cầu 1 (design token, design system, common component). Ảnh tham chiếu: `assets/everyhalf-hero-reference.png`.

## 1. Cách lấy dữ liệu

Trang chủ everyhalf.vn dựng bằng ảnh nền toàn khung và CSS ngoài, nên không đọc được màu qua HTML thô. Dữ liệu dưới đây lấy từ **computed style thật** của trình duyệt (chrome-devtools MCP của plugin ecc): duyệt trang, chạy script gom `getComputedStyle` của mọi phần tử, đếm tần suất màu, font, border, shadow, radius, letter-spacing; chụp màn hình hero.

Trang Larksuite Duy đưa (`ssgwqee1lorp.sg.larksuite.com/drive/home/`) là drive riêng cần đăng nhập, không truy cập được và không được gửi thông tin đăng nhập tới đó. Phần cảm hứng layout ở §6 vì vậy dựa trên mẫu hình sản phẩm Lark/Lark Base đã biết (sidebar trái, thanh trên gọn, vùng làm việc dạng bảng/thẻ, mật độ cao, bề mặt trung tính) cộng chuẩn UI cho công cụ quản trị dữ liệu. Nếu sau này cần bám sát một màn hình Larksuite cụ thể, Duy chụp màn hình gửi vào `assets/` rồi cập nhật mục này.

## 2. Tinh thần thương hiệu

Every Half là nhà rang cà phê Việt Nam, định vị "Unexpectedly interesting coffee roasters from Vietnam". Ngôn ngữ hình ảnh:

- **Biên tập, tối giản, ảnh dẫn dắt.** Hero là ảnh nông trại toàn khung, chữ trắng đè lên, rất nhiều khoảng thở.
- **Đơn sắc ấm ("mực trên giấy").** Gần như chỉ đen ấm, trắng và kem. Màu nhấn gần như không có; điểm nhấn tạo bằng ảnh và tương phản, không bằng màu.
- **Phẳng, sắc nét.** Bóng đổ gần như bằng không; nút lõi bo góc 0; đường viền mảnh như sợi tóc.
- **Vi chữ kỹ thuật.** Nhãn, nút, toạ độ dùng chữ mono in hoa, giãn chữ (ví dụ nhãn hero `ĐẠM FARM / CƯ M'GAR, ĐẮK LẮK / 12.45°N, 108.20°E`). Cảm giác "hồ sơ nguồn gốc", chuẩn xác.
- **Chữ hiển thị grotesque.** Tiêu đề dùng Bricolage Grotesque, thân chữ hiện đại, giãn chữ âm nhẹ ở cỡ lớn.

Tinh thần này hợp với một công cụ quản lý tài sản: chính xác, ít màu mè, đọc nhanh, tôn trọng dữ liệu.

## 3. Bảng màu gốc (trích từ trang)

| Vai trò | Giá trị trích | Hex | Ghi chú |
| --- | --- | --- | --- |
| Mực chính (ấm) | rgb(35,31,32) | `#231F20` | Màu chữ/nét chủ đạo, đen ấm |
| Mực phụ | rgb(17,17,17) | `#111111` | Tiêu đề đậm |
| Đen thuần | rgb(0,0,0) | `#000000` | Dùng lẫn, gộp về mực ấm khi làm hệ thống |
| Giấy | rgb(246,246,243) | `#F6F6F3` | Nền kem chủ đạo |
| Giấy sáng | rgb(249,249,246) | `#F9F9F6` | Nền vùng sáng hơn |
| Trắng | rgb(255,255,255) | `#FFFFFF` | Thẻ, bề mặt nổi |
| Chữ mờ | rgb(85,85,85) | `#555555` | Văn bản phụ |
| Chữ nhạt | rgb(119,119,119) | `#777777` | Chú thích, placeholder |
| Viền | rgb(229,229,229) / rgba(0,0,0,0.05–0.1) | `#E5E5E5` | Viền mảnh |
| Tím (phụ, không cốt lõi) | rgb(110,88,160) | `#6E58A0` | Chỉ xuất hiện lẻ tẻ ở thẻ sản phẩm; **không** đưa vào hệ thống làm màu thương hiệu |

Kết luận màu: thương hiệu về bản chất là **đơn sắc ấm** (đen ấm + kem + xám). Không có màu nhấn thương hiệu ổn định. Hệ thống EH-AM vì vậy giữ **primary = mực ấm**, và **bổ sung** một bộ màu trạng thái riêng cho nghiệp vụ (xem §5.3), vì công cụ quản lý tài sản bắt buộc phải phân biệt trạng thái (đang dùng, đang sửa, thanh lý, nghi mất…) mà trang marketing không cần.

## 4. Kiểu chữ (trích từ trang)

| Vai trò | Font | Bằng chứng |
| --- | --- | --- |
| Hiển thị / tiêu đề | **Bricolage Grotesque** (dự phòng Open Sans, sans-serif) | `--font-heading`, body font, 323+107 phần tử |
| Nhãn / nút / mã / mono | **SUSE Mono** (dự phòng ui-monospace) | 76 phần tử; nút in hoa, weight 600 |

Thang cỡ chữ quan sát được (cỡ/độ đậm/line-height, px):

- Hiển thị lớn: 48/550/60, tiêu đề mục H2: 44/500/52.
- Thân: 16/400/24 và 14/400/28.
- Nhãn mono nhỏ: 12/700/16, 14/600/20.
- Giãn chữ: âm ở tiêu đề lớn (`-0.96px`, `-0.24px`); dương ở nhãn mono (`0.75px`, `1.95px`, `2px`).

Ánh xạ cho EH-AM (ứng dụng dày dữ liệu, ưu tiên đọc bảng):

- **Display/Heading = Bricolage Grotesque.** Dùng cho tiêu đề trang, tiêu đề thẻ, khoảnh khắc thương hiệu (đăng nhập, trạng thái rỗng).
- **Body/UI/số liệu bảng = Inter** (đã có sẵn trong repo). Bricolage hợp tiêu đề nhưng ở cỡ 12–14px dày đặc thì Inter đọc tốt và cân đối số hơn. Đây là lựa chọn "trung thành nhưng dùng được": giữ chất grotesque ở tiêu đề, đảm bảo dễ đọc ở dữ liệu.
- **Mono = SUSE Mono** cho **mã tài sản, mã QR, serial, toạ độ GPS, mã phiếu, dấu thời gian kỹ thuật**. Đây vừa là nét thương hiệu, vừa có ích: mã tài sản canh cột thẳng hàng, khó đọc nhầm 0/O, 1/l. Nhãn cột/chip trạng thái có thể in hoa + giãn chữ theo phong cách trang.

Ghi chú kỹ thuật: cả ba font đều có trên Google Fonts. Cần bổ sung `bricolage` và `suse-mono` vào `src/config/fonts.ts`, thêm `--font-*` trong `theme.css`, và nạp font. Với mục tiêu PWA/offline (Yêu cầu 1), **nên tự host font** (woff2 trong `public/fonts/`, `@font-face` cục bộ) thay vì `<link>` Google Fonts, để chạy offline và tránh nới CSP `style-src`/`font-src` ra miền ngoài. Chi tiết ở tài liệu design system.

## 5. Ánh xạ sang design token EH-AM

### 5.1 Nguyên tắc

Repo đang dùng token shadcn hệ oklch nhưng tông **xám xanh (hue 264)**. Yêu cầu 1 sẽ **chỉnh tông về trung tính ấm** ("mực trên giấy") cho khớp thương hiệu, giữ nguyên cấu trúc biến để không phá vỡ shadcn/Radix. Giữ hệ oklch (đã là chuẩn của repo), kèm hex tham chiếu.

### 5.2 Token nền tảng (light) — đề xuất

| Token | Ý nghĩa | Giá trị đề xuất (oklch) | Hex xấp xỉ |
| --- | --- | --- | --- |
| `--background` | Nền ứng dụng (giấy kem) | `oklch(0.985 0.004 85)` | `#F9F9F6` |
| `--foreground` | Mực ấm | `oklch(0.22 0.006 60)` | `#231F20` |
| `--card` / `--popover` | Bề mặt nổi (trắng) | `oklch(1 0 0)` | `#FFFFFF` |
| `--primary` | Hành động chính (mực) | `oklch(0.24 0.006 60)` | `#26221F` |
| `--primary-foreground` | Chữ trên primary | `oklch(0.985 0.004 85)` | `#F9F9F6` |
| `--secondary` | Nền phụ | `oklch(0.955 0.006 85)` | `#F0EFEA` |
| `--muted` | Nền mờ | `oklch(0.955 0.006 85)` | `#F0EFEA` |
| `--muted-foreground` | Chữ phụ | `oklch(0.5 0.008 65)` | `#6B6560` |
| `--accent` | Nền nhấn hover/chọn | `oklch(0.94 0.008 80)` | `#ECEAE3` |
| `--border` / `--input` | Viền mảnh | `oklch(0.9 0.006 80)` | `#E5E3DD` |
| `--ring` | Vòng focus | `oklch(0.55 0.02 65)` | `#8A8078` |

Dark mode: nền mực ấm (`oklch(0.18 0.006 60)` ~ `#211E1B`), chữ giấy, giữ cùng cấu trúc như `.dark` hiện có nhưng dịch tông ấm.

### 5.3 Token trạng thái nghiệp vụ (bổ sung, không có trên trang)

Công cụ tài sản cần phân biệt trạng thái. Đề xuất bộ tối thiểu, tông trầm ấm để ngồi hài hoà trên nền kem (không chói):

| Token ngữ nghĩa | Dùng cho | Hex xấp xỉ |
| --- | --- | --- |
| `--success` | Đang dùng / hoàn tất / khớp kiểm kê | `#3F7D52` (xanh trầm) |
| `--warning` | Sắp đến hạn / cần chú ý / lệch nhẹ | `#B9862F` (hổ phách) |
| `--danger` (dùng lại `--destructive`) | Mất / huỷ / lỗi / thanh lý bắt buộc | `#B23B3B` (đỏ gạch) |
| `--info` | Đang xử lý / đang vận chuyển / thông tin | `#3E6E93` (lam trầm) |
| `--neutral` (dùng `--muted`) | Nháp / ngừng / lưu trữ | xám ấm |

Mỗi màu trạng thái cần một biến `-foreground` và một biến nền nhạt (`-subtle`) cho chip. Ánh xạ trạng thái tài sản/phiếu cụ thể (theo Phụ lục B của blueprint) sẽ chốt trong tài liệu design system và component chip trạng thái.

### 5.4 Hình khối, viền, bóng, bo góc

- **Bo góc:** trang dùng 0 ở nút lõi, nhưng UI quản trị dày dữ liệu bo nhẹ sẽ thân thiện hơn. Đề xuất giữ `--radius` ở mức **nhỏ (6–8px)** cho thẻ/nút/input, và **0–2px** cho chip/nhãn mono để giữ chất "biên tập". Đây là dung hoà: trung thành tinh thần sắc nét nhưng không cứng cho công cụ dùng cả ngày.
- **Viền:** hairline 1px, màu `--border` ấm. Ưu tiên phân tách bằng viền + khoảng trắng hơn là bằng bóng.
- **Bóng:** mặc định phẳng. Chỉ dùng bóng cho lớp nổi thật sự (dropdown, dialog, popover, sheet): thang `shadow-sm` → `shadow-xl` của Tailwind, không lạm dụng.
- **Underline:** link mặc định không gạch chân (theo trang), gạch chân khi hover; focus dùng ring.

### 5.5 Chuyển động

Trang marketing tối giản, ít animation. EH-AM là công cụ nội bộ nên **chuyển động phải kiềm chế**: dùng chuyển tiếp ngắn (150–250ms, ease-out) cho hover/mở/đóng, tôn trọng `prefers-reduced-motion`. Repo đã có `tw-animate-css` là đủ cho phần lớn nhu cầu. **Không** thêm thư viện animation nặng (GSAP) cho công cụ này trừ khi có màn hình cần thật; quyết định này ghi ở §7 (lựa chọn skill) để tránh over-engineering theo dặn dò của Duy.

## 6. Cảm hứng layout (Lark + chuẩn công cụ quản trị)

Khung màn hình cho EH-AM (đã có sẵn app shell shadcn: sidebar + header):

- **Sidebar trái** gom điều hướng theo module (M01–M12), thu gọn được, có biểu tượng + nhãn; nhóm theo miền nghiệp vụ. Trên mobile chuyển thành drawer (Sheet).
- **Thanh trên (header)** mỏng: ô tìm kiếm lệnh (command menu đã có), chuyển vị trí/location đang xem, chuông thông báo, hồ sơ người dùng, chuyển ngôn ngữ vi/en.
- **Vùng làm việc**: mật độ cao. Mẫu chủ đạo là **bảng dữ liệu** (data-table đã có, URL-synced) cho danh sách tài sản/phiếu; thanh công cụ lọc theo mặt (faceted filter) đã có; **thẻ tóm tắt** ở dashboard; **trang chi tiết** hai cột (thân + panel phụ meta/audit).
- **Vi chữ mono** cho mã và toạ độ như trang chủ (mã tài sản, GPS kiểm kê, mã QR) để giữ nét thương hiệu.
- **Trạng thái rỗng / lỗi** dùng khoảnh khắc thương hiệu: tiêu đề Bricolage, một dòng mono, nhiều khoảng trắng.

Nguyên tắc từ Lark giữ lại: bề mặt trung tính, phân cấp bằng khoảng trắng và viền mảnh, thao tác theo ngữ cảnh (menu chuột phải / hàng), làm việc theo bảng là trung tâm.

## 7. Bộ skill dùng cho Yêu cầu 1 (ghi để không quên — Yêu cầu 4)

Quyết định dùng skill (bám dặn dò của Duy: đủ dùng, đừng nhồi, tránh over-engineering):

| Skill / nguồn | Dùng ở đâu | Lý do |
| --- | --- | --- |
| `frontend-design` (Claude design) | Trục chính khi dựng token, component, style | Skill thiết kế UI cốt lõi, hợp việc dựng hệ thống thật trong repo |
| `ui-ux-pro-max:design-system`, `:ui-styling` | Cấu trúc design system, quy ước style | Khung hệ thống thiết kế và token |
| `taste-skill` (taste, brandkit) | Tinh chỉnh thẩm mỹ, ánh xạ thương hiệu | Giữ gu biên tập, đơn sắc ấm |
| `humanizer` | Soát văn tài liệu design (tiếng Việt) | Văn phong senior, không văn máy |
| **Không dùng nặng:** `gsap-skills`, `hyperframes`, `impeccable` (asset producer) | — | Công cụ nội bộ dày dữ liệu không cần motion/animation nặng hay sản xuất asset marketing. Giữ chuyển động bằng `tw-animate-css`. Sẽ cân nhắc lại nếu có màn hình cần |

Bộ skill cho Yêu cầu 2 (kế hoạch kỹ thuật + triển khai theo UC) ghi ở tài liệu product-implementation.

## 8. Việc tiếp theo (Yêu cầu 1)

1. Tài liệu design token (`10-design-tokens.md`) và cập nhật `src/styles/theme.css` sang tông ấm + token trạng thái.
2. Tài liệu design system (`20-design-system.md`): kiểu chữ, thang cỡ, khoảng cách, hình khối, chuyển động, mật độ, accessibility, quy tắc PWA/responsive.
3. Tài liệu common component (`30-common-components.md`) và dựng component dùng chung phủ mọi tính năng UC (chip trạng thái, ô mã mono, khối audit, khung trang, khung lọc, khung form…).
4. Cập nhật `src/config/fonts.ts`, nạp font Bricolage Grotesque + SUSE Mono (tự host cho PWA).
