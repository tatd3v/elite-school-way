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
  
  return route ? route.component : null
}

Router.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      component: PropTypes.element.isRequired,
    })
  ).isRequired,
}

export function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
