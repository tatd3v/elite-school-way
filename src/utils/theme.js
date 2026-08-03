export function initializeTheme() {
  const saved = localStorage.getItem('theme')
  const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  return isDark
}

export function setTheme(isDark) {
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', isDark)
}

export function getTheme() {
  const saved = localStorage.getItem('theme')
  return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}
