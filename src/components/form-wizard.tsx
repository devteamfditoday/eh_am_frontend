import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = { title: string; description?: string }

export function FormWizardStepper({
  steps,
  currentStep,
  onStepChange,
  label,
}: {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  label: string
}) {
  return (
    <nav aria-label={label} className='overflow-x-auto pb-1'>
      <ol className='flex min-w-max items-center gap-2 lg:min-w-0'>
        {steps.map((step, index) => {
          const complete = index < currentStep
          const active = index === currentStep
          return (
            <li key={step.title} className='flex flex-1 items-center gap-2'>
              <button
                type='button'
                disabled={!complete}
                onClick={() => complete && onStepChange?.(index)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-md px-2 text-left text-sm',
                  complete && 'cursor-pointer hover:bg-muted',
                  !complete && !active && 'cursor-default text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-full border font-medium',
                    (active || complete) &&
                      'border-primary bg-primary text-primary-foreground'
                  )}
                >
                  {complete ? (
                    <Check className='size-4' aria-hidden='true' />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>
                  <span className='block font-medium'>{step.title}</span>
                  {step.description ? (
                    <span className='hidden text-xs text-muted-foreground xl:block'>
                      {step.description}
                    </span>
                  ) : null}
                </span>
              </button>
              {index < steps.length - 1 ? (
                <span className='h-px min-w-4 flex-1 bg-border' />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
