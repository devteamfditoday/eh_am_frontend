# DESIGN — UC-MDM-08: Màn Danh mục phòng ban

> Dùng chung token + common component với [UC-MDM-03](../UC-MDM-03/DESIGN-README.md); phòng ban đơn giản (mã + tên + trạng thái), y hệt cost center. Skill: `frontend-design` + `ui-ux-pro-max` + `taste-skill`. Áp đủ chuẩn UI bắt buộc ở `eh_am_frontend/CLAUDE.md`.
>
> Kế hoạch kỹ thuật: [README.md](./README.md).

## 1. Wireframe — trang danh sách (desktop)

```
┌────────────────────────────────────────────────────────────────┐
│  Danh mục phòng ban                          [ + Thêm phòng ban ]│  ← PageHeader (nút size lg)
│  Đơn vị công tác của nhân viên khối văn phòng và sơ đồ tổ chức.  │
├────────────────────────────────────────────────────────────────┤
│  [ 🔍 Tìm mã hoặc tên… ]        [ Trạng thái ▾ ]      [ ⚙ Cột ▾ ]│  ← toolbar
├──────────────────┬─────────────────────────────┬────────────────┤
│ MÃ               │ TÊN                         │ TRẠNG THÁI     │
├──────────────────┼─────────────────────────────┼────────────────┤
│ VP-KT            │ Phòng Kế toán               │ ● Đang HĐ  │ ⋯ │
│ VP-NS            │ Phòng Nhân sự               │ ● Đang HĐ  │ ⋯ │
│ VP-IT            │ Phòng Công nghệ thông tin   │ ● Đang HĐ  │ ⋯ │
└──────────────────┴─────────────────────────────┴────────────────┘
```

- Cột MÃ: `CodeText`. Nút Sửa (ghost). Trưởng phòng + Ngừng chưa có ở GĐ này.

## 2. Wireframe — dialog Thêm / Sửa

```
        ┌──────────────────────────────────────┐
        │  Thêm phòng ban                 [✕]  │  ← edit: "Sửa phòng ban — VP-KT"
        │  Điền mã và tên phòng ban.            │
        ├──────────────────────────────────────┤
        │  Mã phòng ban *   [ VP-KT          ]  │  ← edit: disabled + hint; gợi ý mã chip
        │  Tên phòng ban *  [ Phòng Kế toán  ]  │
        ├──────────────────────────────────────┤
        │                 [ Huỷ ]   [ Lưu ]      │  ← nút size lg, Lưu min-w-32
        └──────────────────────────────────────┘
```

- Trường bắt buộc gắn `*` đỏ (`RequiredMark`). Trùng mã (EX.2) → lỗi field mã. Xung đột phiên (EX.4) → alert + Tải lại.

## 3. Trạng thái & responsive & a11y

Tải: skeleton. Rỗng: `EmptyState` + nút Thêm (lg). Lỗi tải: alert + Thử lại. < 640px: dialog → sheet; bảng cuộn ngang. Con trỏ theo trạng thái (disabled → not-allowed, đang lưu → wait). Label liên kết, dialog bẫy focus, `StatusBadge` có chấm + chữ.

## 4. Skill dùng

`frontend-design` + `ui-ux-pro-max` + `taste-skill`. Không dùng `gsap-skills`/`hyperframes`/`impeccable`.
