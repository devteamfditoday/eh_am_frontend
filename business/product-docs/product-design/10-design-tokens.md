# Design token EH-AM

> **Yêu cầu 1 — phần token.** Tài liệu này mô tả bộ token màu, kiểu chữ, bo góc của EH-AM và cách dùng. Nguồn nhận diện: [00-nhan-dien-thuong-hieu-everyhalf.md](00-nhan-dien-thuong-hieu-everyhalf.md). Token thật nằm ở `src/styles/theme.css` (biến CSS) và được Tailwind 4 phơi ra thành utility qua khối `@theme inline`.

## 1. Nguyên tắc

- **Một nguồn sự thật:** mọi màu/kiểu chữ khai ở `src/styles/theme.css`. Component **không** viết hex/oklch trực tiếp; luôn dùng token qua class Tailwind (`bg-primary`, `text-muted-foreground`, `border-border`, `font-bricolage`…) hoặc `var(--…)`.
- **Giữ cấu trúc shadcn/Radix:** tên biến giữ nguyên chuẩn shadcn để component có sẵn (`src/components/ui/*`) chạy không sửa. Chỉ đổi *giá trị* (tông xám xanh → trung tính ấm) và *thêm* nhóm trạng thái.
- **Hệ màu oklch:** đồng nhất với repo. Kèm hex xấp xỉ để tham chiếu nhanh.
- **Light + dark:** mọi token có bản `.dark`. Dark mode là mực ấm làm nền, không phải xám xanh.

## 2. Token nền tảng

| Token | Light (hex ~) | Dùng cho |
| --- | --- | --- |
| `--background` | `#F9F9F6` giấy kem | Nền toàn ứng dụng |
| `--foreground` | `#231F20` mực ấm | Chữ chính |
| `--card`, `--popover` | `#FFFFFF` | Thẻ, popover, dialog |
| `--primary` | `#26221F` mực | Nút chính, nhấn mạnh |
| `--primary-foreground` | `#F9F9F6` | Chữ trên primary |
| `--secondary`, `--muted` | `#F0EFEA` | Nền phụ, vùng mờ |
| `--muted-foreground` | `#6B6560` | Chữ phụ, nhãn, placeholder |
| `--accent` | `#ECEAE3` | Nền hover/chọn (menu, hàng bảng) |
| `--border`, `--input` | `#E5E3DD` | Viền mảnh, viền ô nhập |
| `--ring` | xám ấm | Vòng focus bàn phím |
| `--sidebar` | giấy đậm nhẹ | Nền sidebar (tách khỏi nội dung) |

Class Tailwind tương ứng: `bg-background`, `text-foreground`, `bg-card`, `bg-primary text-primary-foreground`, `bg-muted text-muted-foreground`, `bg-accent`, `border-border`, `ring-ring`…

## 3. Token trạng thái nghiệp vụ

Bổ sung so với trang marketing, để phân biệt trạng thái tài sản/phiếu. Mỗi nhóm có ba biến: màu chính (`--x`), chữ trên nền đậm (`--x-foreground`), nền chip nhạt (`--x-subtle`).

| Nhóm | Màu (hex ~) | Ý nghĩa gợi ý |
| --- | --- | --- |
| `--success` | `#3F7D52` xanh trầm | Đang dùng · hoàn tất · khớp kiểm kê · đã duyệt |
| `--warning` | `#B9862F` hổ phách | Sắp đến hạn · cần chú ý · lệch nhẹ · chờ xử lý |
| `--destructive` | `#B23B3B` đỏ gạch | Mất · huỷ · lỗi · quá hạn · thanh lý bắt buộc |
| `--info` | `#3E6E93` lam trầm | Đang xử lý · đang vận chuyển · đang sửa · thông tin |
| `--muted` (neutral) | xám ấm | Nháp · ngừng · lưu trữ · chưa kích hoạt |

Class Tailwind: `bg-success`, `text-success`, `bg-success-subtle`, `text-success-foreground` (và tương tự cho `warning`, `info`, `destructive`). Dùng qua component `StatusBadge` thay vì gọi class trực tiếp (xem [30-common-components.md](30-common-components.md)).

Bảng biểu (dashboard M11) dùng `--chart-1..5` tông ấm/đất.

## 4. Kiểu chữ

| Token | Font | Dùng cho |
| --- | --- | --- |
| `--font-sans` (mặc định body) | Inter | Thân, UI, số liệu bảng, form |
| `--font-bricolage` → class `font-bricolage` | Bricolage Grotesque | Tiêu đề trang/thẻ, khoảnh khắc thương hiệu |
| `--font-mono` → class `font-mono` | SUSE Mono | Mã tài sản, QR, serial, mã phiếu, toạ độ GPS, request id |
| `--font-manrope` | Manrope | Giữ để tương thích cấu hình cũ |

Nạp font qua `<link>` Google Fonts trong `index.html` (đã thêm Bricolage Grotesque + SUSE Mono). Ghi chú `@theme inline`: Tailwind **nội tuyến** giá trị font vào utility nên `getComputedStyle(:root)` đọc `--font-bricolage` ra rỗng là bình thường, không phải lỗi; class `font-bricolage`/`font-mono` vẫn áp đúng font.

## 5. Bo góc, viền, bóng

- `--radius`: `0.5rem` (8px). Thang: `rounded-sm` (4px) · `rounded-md` (6px) · `rounded-lg` (8px) · `rounded-xl` (12px). Chip/nhãn mono dùng bo nhỏ (2–4px) để giữ chất biên tập.
- Viền: luôn `border-border` (1px, ấm). Ưu tiên phân tách bằng viền + khoảng trắng.
- Bóng: phẳng là mặc định. Chỉ dùng bóng cho lớp nổi thật (dropdown/dialog/popover/sheet), theo thang `shadow-sm`→`shadow-xl` của Tailwind. Không đổ bóng lên thẻ tĩnh.

## 6. Accessibility (tương phản)

- Chữ chính (`--foreground` trên `--background`) và chữ trên `--primary` đạt tương phản cao (mực đậm trên giấy sáng).
- Chữ phụ `--muted-foreground` dùng cho nhãn/placeholder, **không** dùng cho nội dung quan trọng cỡ nhỏ.
- Chip trạng thái: không chỉ dựa vào màu. `StatusBadge` có `dot` và luôn kèm nhãn chữ, để phân biệt khi in đen trắng hoặc với người mù màu.
- Focus: mọi phần tử tương tác có vòng `ring-ring` rõ khi dùng bàn phím (đã có trong ui/*).

## 7. Đổi token thế nào

1. Sửa giá trị ở `:root` và `.dark` trong `src/styles/theme.css`.
2. Nếu thêm token mới, khai thêm biến `--color-x` trong `@theme inline` để Tailwind sinh class.
3. Chạy `npm run dev`, kiểm bằng ảnh chụp thật (xem quy trình ở [20-design-system.md](20-design-system.md) §Kiểm thử hình ảnh).
4. Không viết hex trong component.
