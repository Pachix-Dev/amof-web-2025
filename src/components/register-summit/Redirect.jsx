import { useRegisterFormSummit } from '../../store/register-form-summit.js'
import { useEffect } from 'react'

export function Redirect() {
  const { complete_register } = useRegisterFormSummit()

  useEffect(() => {
    if (complete_register !== true) {
      window.location.href = '/'
    }
  }, [complete_register])

  return <></>
}
