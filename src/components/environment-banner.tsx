import { AppEnvironment, env } from '@/config/env'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/**
 * Dải nhận diện môi trường ở đầu trang — CHỈ hiện ở development và staging.
 *
 * ⚠️ VÌ SAO GẮN NHÃN MÔI TRƯỜNG THỬ, KHÔNG GẮN NHÃN PRODUCTION
 *
 * Codebase gốc (Avantily) là web quản trị nội bộ: ở đó production là nơi "nguy hiểm" nên nhãn
 * cảnh báo đặt ở production. Every Half khác: **người dùng chính (nhân viên cửa hàng) chỉ dùng
 * production**, mỗi ngày. Một dải đỏ "MÔI TRƯỜNG THẬT" thường trực trên màn hình của họ là nhiễu,
 * và nhiễu thường trực thì chẳng mấy chốc không ai đọc nữa.
 *
 * Rủi ro thật nằm ở chiều ngược lại: người đi kiểm thử (UAT, đào tạo) thao tác trên staging mà
 * tưởng là thật — hoặc tưởng là staging trong khi đang ở production vì hai tab trông giống nhau.
 * Gắn nhãn rõ cho **mọi môi trường không phải production** là đủ phân biệt, và production giữ sạch.
 *
 * ⚠️ Codebase gốc có biến `VITE_APP_ENV` và nhắc tới component này nhưng chưa từng viết nó.
 */
export function EnvironmentBanner() {
  const { t } = useTranslation()

  if (env.appEnv === AppEnvironment.PRODUCTION) return null

  const tone =
    env.appEnv === AppEnvironment.STAGING
      ? 'bg-amber-500 text-black'
      : 'bg-muted text-muted-foreground'

  return (
    <div
      role='note'
      className={cn(
        'w-full px-3 py-0.5 text-center text-[11px] font-semibold tracking-wide',
        tone
      )}
    >
      {t(`env.${env.appEnv}`)}
    </div>
  )
}
