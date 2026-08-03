import { useState, useEffect } from 'preact/hooks'
import PropTypes from 'prop-types'

export function Router({ routes }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const route = routes.find(r => r.path === currentPath) || routes.find(r => r.path === '*')
  
  if (!route) return null
  
  const Component = route.component
  return typeof Component === 'function' ? <Component /> : Component
}

Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    })
  ).isRequired,
}
