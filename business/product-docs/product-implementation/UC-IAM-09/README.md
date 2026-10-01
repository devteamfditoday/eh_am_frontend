# UC-IAM-09 — Xem sơ đồ tổ chức (Frontend)

## Mục tiêu

Màn `/organization-chart` giúp Quản trị hệ thống và Ban giám đốc đọc nhanh ai
báo cáo cho ai, đồng thời nhìn thấy dữ liệu nhân sự cần hoàn thiện. Đây là màn
chỉ đọc; vị trí trên cây không cấp hoặc thay đổi quyền.

## Luồng màn hình

- Route nạp `GET /org-chart`; chỉ hiện menu cho `SYSTEM_ADMIN`/`EXECUTIVE`.
- Thanh công cụ có tìm tên/mã và chọn độ sâu 1–5 hoặc toàn bộ.
- Tìm kiếm chạy tại client vì toàn bộ ảnh chụp đã được tải: kết quả được tô rõ,
  các thẻ khác giảm nhấn. Nếu không khớp, hiện `0 kết quả` và giữ nguyên cây.
- Mỗi nhánh có nút mở/gập riêng, có `aria-expanded` và vùng chạm tối thiểu 44px.
- Bấm thẻ: Ban giám đốc mở chi tiết tại chỗ; Quản trị hệ thống mở danh sách
  nhân viên với từ khóa mã/tên chính xác để tiếp tục xử lý. Không tạo link tới
  route hồ sơ chưa tồn tại của UC-IAM-08.
- Khối “Dữ liệu cần hoàn thiện” liệt kê cảnh báo thiếu cấp trên/đơn vị/vòng dữ
  liệu, không trộn với cây chính.

## Thành phần

- `OrganizationChartPage`: query, toolbar, trạng thái tải/lỗi/rỗng.
- `OrganizationTree`: canvas `@xyflow/react`, root, mức hiển thị, trạng thái
  mở/gập; node không kéo/nối được vì đây là dữ liệu chỉ đọc.
- `OrganizationNodeCard`: thông tin tối thiểu, trạng thái và chi tiết tại chỗ.
- `OrganizationIssues`: danh sách cảnh báo riêng.
- `highlight-text`: tách đoạn text an toàn, không dùng HTML thô.

## API và lỗi

| API | Trạng thái UI |
| --- | --- |
| `GET /org-chart` thành công | Cây và danh sách cần sửa |
| 401 / `ACCOUNT_INACTIVE` | Luồng phiên hiện hữu đưa về đăng nhập |
| `ROLE_REQUIRED` | Trang 403; không giữ dữ liệu cây |
| timeout/network/5xx | EmptyState lỗi + nút “Tải lại”, không hiện dữ liệu một phần |

## Kiểm thử

- Tìm kiếm có/không kết quả; không dim cả cây khi 0 kết quả.
- Giới hạn độ sâu và mở/gập nhánh độc lập.
- Nhãn trạng thái qua i18n, không render enum thô.
- Vai trò EXECUTIVE chỉ mở chi tiết tại chỗ.
- Loading/error/empty/cycle issue và keyboard/a11y.
