'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDark(isDark)
  }, [])

  const toggle = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      html.classList.add('light')
      setDark(false)
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
      setDark(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded border border-gray-700 hover:border-cyber-green/50 transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
