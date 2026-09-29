// sort-imports-ignore — giữ `zod-config` đứng trước `i18n` (xem `src/main.tsx`).
/**
 * Chạy trước mọi test file.
 *
 * ⚠️ VÌ SAO CẦN
 *
 * `main.tsx` gọi `import './lib/i18n'` để chạy `i18next.init()` **trước** khi component nào render.
 * Test không đi qua `main.tsx`, nên nếu không init ở đây thì mọi component gọi `useTranslation()` sẽ
 * đổ với `NO_I18NEXT_INSTANCE`.
 *
 * Triệu chứng rất dễ hiểu sai: `search-provider.test.tsx` có 8 phép thử **không liên quan gì tới
 * ngôn ngữ**, nhưng cả 8 cùng đỏ ngay khi `CommandMenu` bắt đầu dùng `t()`. Người đọc log sẽ đi tìm
 * lỗi ở bảng lệnh thay vì ở cấu hình test.
 *
 * ⚠️ Import này là **side-effect**, không lấy giá trị gì. Đừng đổi thành `import { i18n } from …`
 * rồi bỏ đi vì "không dùng biến" — bundler sẽ loại bỏ cả lời gọi `init()`.
 *
 * `zod-config` đứng đầu vì cùng lý do như trong `main.tsx`: cấu hình Zod phải có trước schema nào.
 */
import '@/lib/zod-config'
import '@/lib/i18n'
