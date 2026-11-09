import { useState } from 'react'
import { Eye, EyeOff } from 'reicon-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function PasswordInput(
  props: Omit<React.ComponentProps<typeof Input>, 'type'>
): React.JSX.Element {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className="pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-0.5 right-0.5"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  )
}
