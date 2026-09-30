import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'

gsap.registerPlugin(useGSAP)

/**
 * Panel thương hiệu bên phải màn đăng nhập (chỉ hiện từ breakpoint lg).
 *
 * Bố cục lấy cảm hứng login hai cột của Larksuite (form một bên, mảng thương hiệu một bên),
 * nhưng đổi sang nhận diện Every Half: nền espresso ấm, chữ kem, hoạ tiết cà phê trôi nhẹ +
 * parallax theo chuột, quầng sáng amber dịch chuyển. Đây là "khoảnh khắc thương hiệu" nên
 * dùng motion nhiều hơn phần còn lại của ứng dụng (vốn tiết chế).
 *
 * ⚠️ Tôn trọng `prefers-reduced-motion`: khi người dùng tắt hiệu ứng thì chỉ hiện bố cục
 * tĩnh, không chạy vòng lặp/parallax. Panel mang `aria-hidden` vì là trang trí; nội dung thao
 * tác thật nằm ở cột form.
 */
export function BrandPanel() {
  const root = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-anim]', { opacity: 1, y: 0 })
        gsap.set('.eh-float', { opacity: 1, scale: 1 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('[data-anim="wordmark"]', { y: -20, opacity: 0, duration: 0.7 })
          .from(
            '.eh-float',
            { scale: 0, opacity: 0, duration: 0.9, stagger: 0.07 },
            '-=0.3'
          )
          .from(
            '[data-anim="headline"]',
            { y: 28, opacity: 0, duration: 0.9 },
            '-=0.6'
          )
          .from(
            '[data-anim="sub"]',
            { y: 18, opacity: 0, duration: 0.7 },
            '-=0.55'
          )
          .from(
            '[data-anim="footer"]',
            { y: 12, opacity: 0, duration: 0.6 },
            '-=0.4'
          )

        // Vòng lặp trôi cho từng hoạ tiết.
        gsap.utils.toArray<HTMLElement>('.eh-float').forEach((el, i) => {
          gsap.to(el, {
            yPercent: i % 2 ? 16 : -16,
            rotation: i % 2 ? 10 : -8,
            duration: 3.5 + (i % 4),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.15,
          })
        })

        // Quầng sáng dịch chuyển chậm.
        gsap.to('.eh-glow', {
          xPercent: 12,
          yPercent: -10,
          scale: 1.15,
          duration: 9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })

        // Parallax theo con trỏ — bọc contextSafe để dọn đúng khi unmount.
        const onMove = contextSafe?.((event: PointerEvent) => {
          const el = root.current
          if (!el) return
          const rect = el.getBoundingClientRect()
          const cx = (event.clientX - rect.left) / rect.width - 0.5
          const cy = (event.clientY - rect.top) / rect.height - 0.5
          gsap.utils.toArray<HTMLElement>('.eh-parallax').forEach((layer) => {
            const depth = Number(layer.dataset.depth ?? '20')
            gsap.to(layer, {
              x: cx * depth,
              y: cy * depth,
              duration: 0.7,
              ease: 'power2.out',
            })
          })
        })

        const node = root.current
        if (node && onMove) {
          node.addEventListener('pointermove', onMove)
          return () => node.removeEventListener('pointermove', onMove)
        }
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div
      ref={root}
      aria-hidden
      className='relative hidden overflow-hidden bg-[linear-gradient(150deg,#211E1B_0%,#332618_55%,#4A3222_100%)] text-[#F5F1EA] lg:block'
    >
      {/* Quầng sáng amber trôi */}
      <div className='eh-glow pointer-events-none absolute -top-24 -right-16 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(201,138,62,0.45),transparent_70%)] blur-2xl' />
      <div className='eh-glow pointer-events-none absolute -bottom-32 -left-24 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(120,90,60,0.4),transparent_70%)] blur-2xl' />

      {/* Hoạ tiết trôi + parallax */}
      <div
        data-depth='34'
        className='eh-float eh-parallax pointer-events-none absolute top-[18%] right-[22%] size-16 rounded-full border border-[#F5F1EA]/20'
      />
      <div
        data-depth='22'
        className='eh-float eh-parallax pointer-events-none absolute top-[62%] right-[14%] size-24 rounded-full border border-[#C98A3E]/30'
      />
      <div
        data-depth='46'
        className='eh-float eh-parallax pointer-events-none absolute top-[42%] left-[16%] size-3 rounded-full bg-[#C98A3E]/60'
      />
      {/* Hạt cà phê */}
      <svg
        data-depth='30'
        className='eh-float eh-parallax pointer-events-none absolute top-[28%] left-[26%] size-12 text-[#F5F1EA]/25'
        viewBox='0 0 24 24'
        fill='none'
      >
        <ellipse
          cx='12'
          cy='12'
          rx='7'
          ry='10'
          transform='rotate(30 12 12)'
          stroke='currentColor'
          strokeWidth='1.2'
        />
        <path
          d='M8 6 C13 10, 11 14, 16 18'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
        />
      </svg>
      {/* Motif "một nửa" — nửa đĩa (ý niệm Every Half) */}
      <div
        data-depth='18'
        className='eh-float eh-parallax pointer-events-none absolute right-[30%] bottom-[22%] size-10 overflow-hidden rounded-full'
      >
        <div className='h-full w-1/2 bg-[#C98A3E]/50' />
      </div>

      {/* Nội dung thương hiệu */}
      <div className='relative z-10 flex h-full flex-col justify-between p-12 xl:p-16'>
        <div
          data-anim='wordmark'
          className='flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[#F5F1EA]/70 uppercase'
        >
          <img
            src='/images/every-half-logo.png'
            alt=''
            aria-hidden
            className='size-7 shrink-0 object-contain invert'
          />
          Every Half
        </div>

        <div className='max-w-md'>
          <h2
            data-anim='headline'
            className='font-bricolage text-4xl leading-tight font-semibold tracking-tight text-balance xl:text-5xl'
          >
            {t('auth.brandHeadline')}
          </h2>
          <p
            data-anim='sub'
            className='mt-4 text-sm leading-relaxed text-[#F5F1EA]/70'
          >
            {t('auth.brandTagline')}
          </p>
        </div>

        <div
          data-anim='footer'
          className='font-mono text-[11px] tracking-[0.18em] text-[#F5F1EA]/50 uppercase'
        >
          {t('auth.brandFooter')}
        </div>
      </div>
    </div>
  )
}
