'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

interface ReCAPTCHAProps {
  sitekey: string;
  onChange: (token: string | null) => void;
}

export function ReCAPTCHA({ sitekey, onChange }: ReCAPTCHAProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoad`
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    window.onRecaptchaLoad = () => {
      if (ref.current) {
        window.grecaptcha.render(ref.current, {
          sitekey: sitekey,
          callback: onChange,
        })
      }
    }

    return () => {
      document.body.removeChild(script)
      delete window.onRecaptchaLoad
    }
  }, [sitekey, onChange])

  return <div ref={ref} />
}

