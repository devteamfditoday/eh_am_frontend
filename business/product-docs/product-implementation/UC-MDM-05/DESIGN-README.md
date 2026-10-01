# DESIGN - UC-MDM-05: Danh mục nhà cung cấp

> Design read: màn quản trị nội bộ cho Quản lý tài sản, ưu tiên quét nhanh và nhập liệu chính xác; giữ ngôn ngữ "mực trên giấy" của EH-AM, shadcn/TanStack hiện có và không thêm animation trang trí.
>
> Dials: `DESIGN_VARIANCE: 3`, `MOTION_INTENSITY: 2`, `VISUAL_DENSITY: 7`. `taste-skill` không dùng để tái thiết kế dashboard; chỉ dùng các kiểm tra về trạng thái, tương phản và tính nhất quán.

## 1. Token và component

| Vai trò | Component/token |
| --- | --- |
| Khung trang | `Header` + `Main` |
| Tiêu đề/hành động | `PageHeader`, `Button size='lg'` |
| Nền và viền | `--background`, `--card`, `--border`, `--radius` hiện có |
| Mã số thuế | `CodeText` để dễ quét, không coi là enum |
| Trạng thái | `StatusBadge`, nhãn i18n đầy đủ |
| Form | shadcn `Form`, `Input`, `RequiredMark`, dialog `sm:max-w-3xl` |
| Ngừng | `DeactivateCatalogDialog`, mở rộng target để nhận nhãn supplier |

### Component dùng chung và ranh giới tái sử dụng

- Giữ `Header`, `Main`, `PageHeader`, `DataTableToolbar`, `DataTablePagination`, `EmptyState`, `StatusBadge`, `CodeText` và `RequiredMark` ở thư mục common hiện tại.
- Mở rộng `DeactivateCatalogDialog` từ target chỉ có `code` sang `label` dùng chung. Cost center, lý do và loại tài sản vẫn truyền mã; supplier truyền tên. Không tạo một dialog ngừng riêng chỉ vì supplier không có mã.
- Logic sinh và giữ `Idempotency-Key` được tách thành hook/helper dùng chung ở tầng API hoặc hook, vì mọi lệnh ghi sau này đều cần cùng hành vi khi mất kết nối.
- `SupplierContact` chỉ tách thành component riêng nếu cả cell bảng và form thực sự dùng chung cách trình bày. Không tạo abstraction trước khi có hai nơi dùng.

## 2. Wireframe trang danh sách desktop

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Danh mục nhà cung cấp                              [ + Thêm nhà cung cấp ] │
│ Thông tin đối tác dùng khi ghi nhận nguồn mua của tài sản.                 │
├────────────────────────────────────────────────────────────────────────────┤
│ [ Tìm tên, mã số thuế hoặc liên hệ... ] [ Trạng thái ▾ ]       [ Cột ▾ ]  │
├──────────────────────┬─────────────────┬────────────────────┬──────────────┤
│ TÊN                  │ MÃ SỐ THUẾ      │ NGƯỜI LIÊN HỆ      │ TRẠNG THÁI   │
├──────────────────────┼─────────────────┼────────────────────┼──────────────┤
│ Công ty Minh An      │ 0312345678      │ Trần An            │ Đang HĐ  Sửa│
│                      │                 │ 0901 234 567        │         Ngừng│
│ Nhà cung cấp cá nhân │ Chưa cung cấp   │ Chưa cung cấp       │ Đang HĐ      │
├──────────────────────┴─────────────────┴────────────────────┴──────────────┤
│ 2 / 2 dòng                                      [<] Trang 1/1 [>]          │
└────────────────────────────────────────────────────────────────────────────┘
```

- Không bịa dữ liệu seed từ wireframe. Smoke dùng tên kỹ thuật rõ là dữ liệu kiểm thử.
- Email hiện dưới số điện thoại bằng chữ phụ. Giá trị thiếu dùng nhãn tự nhiên, không dùng dấu gạch trống khó hiểu.
- Dòng `INACTIVE` mờ vừa phải; nút Sửa và Ngừng bị disabled với `cursor-not-allowed`.

## 3. Wireframe dialog thêm/sửa

```text
        ┌────────────────────────────────────────────────────┐
        │ Thêm nhà cung cấp                              [x] │
        │ Chỉ tên là bắt buộc. Các thông tin còn lại có thể │
        │ bổ sung sau.                                       │
        ├────────────────────────────────────────────────────┤
        │ Tên nhà cung cấp *                                  │
        │ [                                                  ]│
        │                                                     │
        │ Mã số thuế                  Người liên hệ            │
        │ [                         ]  [                     ] │
        │ 10 số hoặc 10 số-3 số                                │
        │                                                     │
        │ Số điện thoại               Email                    │
        │ [                         ]  [                     ] │
        │                                                     │
        │                           Huỷ       [ Lưu ]           │
        └────────────────────────────────────────────────────┘
```

- Desktop dùng lưới hai cột cho bốn trường tùy chọn; tên chiếm toàn hàng.
- Dưới 640px chuyển một cột; dialog giữ khoảng đệm và vùng chạm ít nhất 44px.
- Edit dùng cùng form và mang `version` ẩn. Không khóa mã số thuế vì AC.1 cho phép sửa.
- Nút Lưu có `aria-busy`, giữ form khi lỗi. `DUPLICATE_RECORD` đặt focus vào mã số thuế.

## 4. Wireframe dialog ngừng

```text
        ┌────────────────────────────────────────────────────┐
        │ Ngừng nhà cung cấp Công ty Minh An             [x] │
        │ Nhà cung cấp sẽ không còn trong danh sách chọn mới.│
        │ Hồ sơ và lịch sử cũ vẫn giữ nguyên tên.             │
        ├────────────────────────────────────────────────────┤
        │ Lý do ngừng *  [ Chọn lý do...                  ▾ ] │
        │ Ghi rõ lý do * [                                  ] │
        │                 [                                  ] │
        │                          Huỷ [ Xác nhận ngừng ]      │
        └────────────────────────────────────────────────────┘
```

- Ô ghi rõ lý do chỉ hiện và bắt buộc khi mục được chọn có `isFreetext`.
- Xung đột phiên chuyển nội dung dialog sang lời nhắc tải lại; không tự ghi đè.
- Không có cảnh báo "đang được sử dụng" vì UC cho phép ngừng supplier đã có trong hồ sơ cũ.

## 5. Trạng thái màn hình

| Trạng thái | Hiển thị |
| --- | --- |
| Đang tải | Skeleton đúng chiều cao bảng, `aria-busy` |
| Danh mục rỗng | `EmptyState` + nút Thêm nhà cung cấp đầu tiên |
| Không khớp bộ lọc | Một hàng thông báo + hành động xóa bộ lọc |
| Lỗi tải | `EmptyState variant='error'` + Thử lại |
| Lỗi form | Gần field, `aria-invalid` và `aria-describedby` |
| Xung đột | Alert trong dialog + Hủy/Tải lại |
| Thành công | Toast ngắn, đóng dialog, invalidate nhánh supplier |

## 6. Responsive và a11y

- Desktop hiển thị bốn nhóm cột. Tablet gộp email/số điện thoại dưới tên liên hệ. Mobile cho bảng cuộn ngang, không cắt thao tác.
- Mỗi input có label thật; chỉ tên có `RequiredMark` ở form supplier. Lý do/note có dấu bắt buộc đúng điều kiện.
- Dialog bẫy focus, đóng bằng Esc và trả focus về nút mở. Icon chỉ trang trí dùng `aria-hidden`; icon-only phải có `aria-label`.
- Trạng thái luôn có chữ, không chỉ màu. Light/dark dùng token hiện có và giữ tương phản WCAG AA.
- Không thêm GSAP hoặc motion mới; chỉ dùng trạng thái hover/focus/active sẵn của component.

### Ma trận cursor và phản hồi

| Context | Cursor/trạng thái |
| --- | --- |
| Nút, chip lọc, hàng có hành động | `cursor-pointer` |
| Nút Sửa/Ngừng của supplier đã `INACTIVE` | `cursor-not-allowed`, trạng thái disabled có độ tương phản rõ |
| Nút đang lưu/ngừng | `aria-busy=true`, cursor chờ từ `Button` common |
| Tooltip giải thích định dạng mã số thuế | `cursor-help` nếu dùng trigger trợ giúp |
| Text và cell không có hành động | Cursor mặc định, không giả tín hiệu có thể bấm |

### Kết luận từ các design skill

- `frontend-design`/ECC: giữ hierarchy của màn vận hành, hành động chính nằm ở `PageHeader`, form chia nhóm nhận diện và liên hệ.
- `ui-ux-pro-max`: label luôn hiện, lỗi sát field, touch target tối thiểu 44px, responsive một cột dưới 640px và không dùng màu làm tín hiệu duy nhất.
- `taste-skill`: đây là dashboard/data table nên không áp layout marketing, glassmorphism, hero hoặc animation trang trí.
- Impeccable, mode `Operate`: scanability, trạng thái đầy đủ, nội dung thật và pattern hiện hữu quan trọng hơn biểu đạt thị giác mới.
- GSAP core/react/performance: màn không có timeline hoặc chuyển cảnh phức tạp; thêm GSAP sẽ tăng bundle và công việc compositor mà không truyền đạt thêm trạng thái. Dùng CSS state hiện có, giữ GSAP cho brand moment đã có ở auth.
- Humanizer: soát riêng toàn bộ tiêu đề, label, helper, empty/error/success copy ở cả `vi` và `en` trước khi chốt.
