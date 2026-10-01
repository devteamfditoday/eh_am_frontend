# UC-AST-05 — Đổi người chịu trách nhiệm (kế hoạch frontend)

- Trên `/assets/$id`, hiển thị CTA cho Asset Manager hoặc Location Manager khi hồ sơ chưa kết thúc và location không phải `EXTERNAL`.
- Dialog tải options theo asset để server áp scope; hiển thị người hiện tại ở trạng thái chỉ đọc, chọn người mới, lý do và ghi chú. Mục “Khác” bắt buộc ghi rõ.
- Mutation mang `profileVersion` + khóa chống trùng, thành công làm mới detail/list/timeline. Version conflict mời tải bản mới; ứng viên hết quyền giữ form và yêu cầu chọn lại.
- Copy vi/en dùng câu ngắn, nêu hành động tiếp theo; label luôn hiển thị, lỗi cạnh trường, focus trap/keyboard do Dialog, vùng chạm tối thiểu 44px trên mobile.
