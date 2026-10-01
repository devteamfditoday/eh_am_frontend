# UC-IAM-13 — Cho nhân viên nghỉ việc (kế hoạch frontend)

- Nút chỉ hiện ở hồ sơ ACTIVE/SUSPENDED của người khác.
- Dialog tóm tắt tác động bằng số cấp dưới/vai trò/tài sản; nếu có cấp dưới thì bắt buộc chọn một cấp
  trên mới đang hoạt động; chọn lý do TERMINATION và note khi “Khác”.
- Xác nhận destructive, nêu rõ không thể mở lại từ màn hình này. Thành công refetch profile/list/org
  chart; cảnh báo riêng nếu phiên chưa thu hồi hết nhưng tài khoản đã ngừng.
- Tài sản hiện rỗng cho tới M03; UI vẫn có section để contract không phải thiết kế lại.
- A11y: dialog description đầy đủ, field label, alert, focus trap, touch target 44px, vi/en.

