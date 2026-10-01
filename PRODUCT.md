# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Quản trị hệ thống quản lý cấu hình, danh mục, người dùng và phân quyền toàn nền tảng.
- Quản lý tài sản duy trì hồ sơ và danh mục dùng chung cho chuỗi Every Half.
- Quản lý điểm và nhân viên thao tác tài sản trong phạm vi cửa hàng, kho, xưởng rang hoặc văn phòng được giao.
- Kế toán và người duyệt sử dụng các phần tài chính, đối soát, điều chuyển, sửa chữa và thanh lý theo vai trò.

## Product Purpose

EH-AM quản lý tài sản và công cụ dụng cụ của Every Half từ lúc tạo hồ sơ, dán QR, kiểm kê, điều chuyển, sửa chữa đến thanh lý. Thành công nghĩa là dữ liệu hiện tại đáng tin cậy, thay đổi truy được người và lý do, người dùng hoàn thành công việc đúng phạm vi mà không phải hiểu cấu trúc kỹ thuật bên dưới.

## Positioning

Sản phẩm nối hồ sơ tài sản với location, người chịu trách nhiệm, lịch sử thay đổi và quy trình vận hành thực tế của chuỗi Every Half. Mọi thay đổi quan trọng được kiểm quyền theo phạm vi và ghi audit nguyên tử.

## Operating Context

- Web quản trị dùng trên desktop; các luồng QR và kiểm kê còn phải dùng tốt trên điện thoại.
- Backend NestJS phục vụ `/v1` ở cổng 3006; frontend React/Vite ở cổng 5175.
- Danh mục nền được dùng lại trong hồ sơ tài sản và các quy trình về sau. Mục đã ngừng không được chọn cho dữ liệu mới nhưng vẫn giữ nguyên trong lịch sử cũ.
- Giao diện hỗ trợ tiếng Việt và tiếng Anh. Tiếng Việt là nguồn nội dung chính.

## Capabilities and Constraints

- React 19, Vite, TanStack Router/Query/Table, Tailwind 4, shadcn/Radix, Zustand, Zod và i18next.
- Backend dùng service role, vì vậy quyền và phạm vi được thực thi tại API chứ không dựa vào việc ẩn nút trên UI.
- Không hiển thị enum database thô; mã do người dùng nhập dùng `CodeText`.
- Không xoá cứng dữ liệu nghiệp vụ. Thao tác ngừng cần lý do và audit.
- Không hardcode credential, không bịa số liệu hoặc dữ liệu nghiệp vụ chưa được xác nhận.
- Route sinh tự động nằm ở `src/routeTree.gen.ts` và không được sửa tay.

## Brand Commitments

- Tên sản phẩm: Every Half Asset Management (EH-AM).
- Nhận diện hiện tại là đơn sắc ấm, “mực trên giấy”, kế thừa everyhalf.vn.
- Token, typography và component hiện có trong `src/styles/theme.css` cùng `business/product-docs/product-design/` là thẩm quyền thiết kế.
- Màn làm việc ưu tiên sự yên tĩnh, dễ quét và chính xác. Chuyển động mạnh chỉ dành cho khoảnh khắc thương hiệu như trang đăng nhập.

## Evidence on Hand

- Master Blueprint và 83 use case ở repo backend.
- Tài liệu nhận diện, token, design system và common component ở `business/product-docs/product-design/`.
- Logo chính thức trong `public/images/every-half-logo.png`.
- Không tự tạo khách hàng, số liệu, KPI, nhà cung cấp hoặc tuyên bố kinh doanh chưa có trong tài liệu nguồn.

## Product Principles

1. Dữ liệu đúng và truy vết được quan trọng hơn thao tác nhanh nhưng mơ hồ.
2. Quyền thật nằm ở máy chủ; UI giúp người dùng hiểu khả năng của mình nhưng không phải biên bảo mật.
3. Màn hình phải nói bằng ngôn ngữ công việc của người dùng, không dùng mã kỹ thuật khi có thể dịch rõ.
4. Component và pattern lặp lại phải nhất quán để người dùng học một lần và dùng ở nhiều module.
5. Mỗi UC được hoàn thành, kiểm chứng và manual test riêng trước khi mở rộng sang UC kế tiếp.

## Accessibility & Inclusion

- Tương tác bàn phím đầy đủ, focus rõ, dialog quản lý focus đúng và vùng chạm tối thiểu 44px trên mobile.
- Không truyền đạt trạng thái chỉ bằng màu; mọi input có label và lỗi được liên kết bằng ARIA.
- Cursor phản ánh đúng trạng thái tương tác; loading dùng `aria-busy`; chuyển động tôn trọng `prefers-reduced-motion`.
- Nội dung Việt/Anh phải tự nhiên, ngắn gọn và dễ hiểu với người đang thực hiện nghiệp vụ.
