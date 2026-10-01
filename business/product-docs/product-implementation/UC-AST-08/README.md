# UC-AST-08 — Xem hồ sơ chi tiết tài sản (kế hoạch frontend)

## 1. Màn hình và điều hướng

- Tạo route `/assets/$assetId`; Asset ID và tên trong bảng `/assets` là liên kết tới hồ sơ.
- Trang chi tiết dùng `Header` + `Main`, có liên kết quay lại danh sách, tiêu đề tên tài sản, Asset ID dạng
  `CodeText`, badge trạng thái vòng đời và tình trạng vật lý ngay đầu trang.
- Nội dung desktop chia hai cột cân đối: thông tin tài sản; vị trí và trách nhiệm; thông tin mua/cost center;
  tài chính chỉ render khi API trả `financial` khác `null`. Chứng từ và timeline nằm phía dưới, timeline rộng toàn trang.
- Không suy luận quyền từ frontend để hiện dữ liệu tài chính; response server là nguồn sự thật.

## 2. API và trạng thái

- `getAssetDetail(id)` → `GET /assets/:id`; `assetKeys.detail(id)` và query option riêng.
- Loading: skeleton có `aria-busy`; lỗi 404/ngoài phạm vi: EmptyState trung tính, không nhắc rằng tài sản tồn tại;
  lỗi mạng/server: EmptyState lỗi + Thử lại; luôn có đường quay lại danh sách.
- Chứng từ rỗng hiển thị thông báo ngắn “Chưa có chứng từ đính kèm”. API chưa có metadata chứng từ cho đến
  UC-AST-06, nên không render nút tải giả.
- Timeline cũ → mới; mỗi sự kiện là nút mở/đóng chi tiết bằng `Collapsible`, hỗ trợ bàn phím và `aria-expanded`.

## 3. Nội dung và hiển thị

- Mọi enum/event code qua i18n vi/en; mã tài sản, mã location, mã cost center, mã nhân viên dùng `CodeText`.
- Giá trị trống dùng DescriptionList thống nhất; ngày giờ theo locale hiện tại.
- Nếu `readOnly=true`, hiển thị nhãn giải thích hồ sơ đã kết thúc. UC này không có nút sửa nên không tạo action giả.
- Timeline không hiển thị raw JSON khó hiểu: đổi tên trường đã biết qua i18n, hiển thị trước → sau; event không có
  thay đổi vẫn hiện người thực hiện, thời gian và lý do nếu có.

## 4. A11y, responsive và test

- Heading theo thứ bậc; card có tiêu đề; timeline là `<ol>`; nút mở sự kiện có vùng chạm tối thiểu 44px trên mobile,
  focus ring rõ, icon trang trí `aria-hidden`.
- Mobile xếp một cột và không cuộn ngang; chuỗi dài được ngắt; badge được wrap.
- Test: helper trạng thái kết thúc; liên kết bảng đúng route; trang không dựng vùng tài chính khi `financial:null`;
  loading/error/empty timeline có copy đúng.

