import { useState, useEffect } from 'react'

export default function Header() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  // Restore saved theme if exists, otherwise default to user preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    let activeTheme = savedTheme

    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      activeTheme = prefersDark ? 'dark' : 'light'
      localStorage.setItem('theme', activeTheme)
    }

    const isDark = activeTheme === 'dark'
    setIsDarkTheme(isDark)
    document.body.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.body.classList.toggle('dark', newTheme)
  }

  return (
    <div className='header'>
      <h1>calculator</h1>
      <p className='toggler' onClick={toggleTheme}>
        {isDarkTheme ? '\u263D' : '\u2600'}
      </p>
    </div>
  )
}
