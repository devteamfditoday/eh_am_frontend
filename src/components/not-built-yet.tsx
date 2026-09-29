import { Construction } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'

interface NotBuiltYetProps {
  /** Tiêu đề trang, để người dùng biết mình đang ở đâu. */
  title: string
  /** Một câu nói trang này **sẽ** làm gì, để người đọc biết đây đúng chỗ họ cần. */
  purpose: string
  /** Đường dẫn tài liệu đặc tả (tương đối trong `eh_am_backend/business/product-docs/`), nếu đã có. */
  specPath?: string
}

/**
 * Trang chưa xây.
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG `ComingSoon` CỦA BOILERPLATE
 *
 * "Stay tuned though!" đọc như một trang marketing, không như một trạng thái của hệ thống nội bộ.
 * Người dùng bấm vào đây cần biết ba điều: trang này sẽ làm gì, đây là lỗi hay là chưa làm, và tra
 * ở đâu để biết thêm.
 *
 * ⚠️ Component này **không** phải chỗ để tồn tại lâu. Một mục menu trỏ tới đây là một lời hứa chưa
 * có gì đằng sau; nếu nó ở đó quá một chu kỳ phát triển thì nên bỏ mục menu đi cho tới khi tính
 * năng thật xong.
 */
export function NotBuiltYet({ title, purpose, specPath }: NotBuiltYetProps) {
  const { t } = useTranslation()

  return (
    <Main>
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center'>
        <Construction className='text-muted-foreground' size={56} />

        <div className='space-y-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
          <p className='max-w-prose text-sm text-muted-foreground'>{purpose}</p>
        </div>

        <p className='text-xs text-muted-foreground'>
          {t('notBuiltYet.status')}
        </p>

        {specPath ? (
          <p className='text-xs text-muted-foreground'>
            {t('notBuiltYet.spec')}:{' '}
            <code className='rounded bg-muted px-1.5 py-0.5 font-mono'>
              eh_am_backend/business/product-docs/{specPath}
            </code>
          </p>
        ) : null}
      </div>
    </Main>
  )
}
