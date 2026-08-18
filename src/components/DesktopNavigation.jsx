import { useState, useEffect, useRef } from 'preact/hooks'
import PropTypes from 'prop-types'

function DesktopNavigation({ activeTab = 'dashboard', onTabChange, onWidthChange }) {
  const MIN_WIDTH = 200
  const MAX_WIDTH = 400
  const DEFAULT_WIDTH = 288 // 72 * 4 (w-72)
  const COLLAPSED_WIDTH = 80 // Icon-only mode

  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH
  })
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved === 'true'
  })
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef(null)
  const expandedWidthRef = useRef(width)

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Panel Principal' },
    { id: 'participants', icon: 'groups', label: 'Participantes', filled: true },
    { id: 'faculty', icon: 'school', label: 'Staff' },
    { id: 'competitions', icon: 'military_tech', label: 'Competiciones' },
    { id: 'settings', icon: 'settings', label: 'Ajustes' },
  ]

  useEffect(() => {
    const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width
    if (onWidthChange) {
      onWidthChange(currentWidth)
    }
  }, [width, isCollapsed, onWidthChange, COLLAPSED_WIDTH])

  const toggleCollapse = () => {
    if (!isCollapsed) {
      // Collapsing: save current width
      expandedWidthRef.current = width
    } else {
      // Expanding: restore previous width
      setWidth(expandedWidthRef.current)
    }
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString())
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth)
        localStorage.setItem('sidebarWidth', newWidth.toString())
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleNavClick = (itemId) => {
    if (onTabChange) {
      onTabChange(itemId)
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width

  return (
    <aside
      ref={sidebarRef}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 hidden md:flex flex-col bg-surface-container border-r border-outline-variant/10 transition-all duration-300"
      style={{ width: `${currentWidth}px` }}
    >
      {/* Header Section with Toggle */}
      <div
        className={`h-24 p-3 flex items-center ${isCollapsed ? 'flex-col justify-center gap-2' : 'flex-row justify-between'}`}
      >
        {isCollapsed ? (
          <>
            <span
              className="material-symbols-outlined text-primary text-2xl w-8 h-8 flex items-center justify-center leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
            <button
              onClick={toggleCollapse}
              className="w-8 h-8 p-0 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors ring-1 ring-outline-variant/20"
              title="Expandir"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-2xl w-8 h-8 flex items-center justify-center leading-none">
                chevron_right
              </span>
            </button>
          </>
        ) : (
          <>
            <div className="flex-1">
              <h2 className="text-on-surface-variant text-label-md font-bold">Administración</h2>
            </div>
            <button
              onClick={toggleCollapse}
              className="w-8 h-8 p-0 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors ml-2 ring-1 ring-outline-variant/20"
              title="Contraer"
            >
              <span className="material-symbols-outlined text-primary text-2xl w-8 h-8 flex items-center justify-center leading-none">chevron_left</span>
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const iconFill = isActive && item.filled ? 1 : 0

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-full transition-all cursor-pointer ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span
                className="material-symbols-outlined text-2xl w-8 h-8 flex items-center justify-center leading-none"
                style={{ fontVariationSettings: `'FILL' ${iconFill}` }}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span className="font-label-md">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className={`border-t border-outline-variant/10 ${isCollapsed ? 'p-4' : 'p-6'}`}>
        <button
          className={`w-full flex items-center gap-3 py-3 text-on-surface-variant hover:text-error transition-colors ${
            isCollapsed ? 'justify-center px-2' : 'px-4'
          }`}
          title={isCollapsed ? 'Cerrar Sesión' : ''}
        >
          <span className="material-symbols-outlined text-2xl w-8 h-8 flex items-center justify-center leading-none">logout</span>
          {!isCollapsed && <span className="font-label-md">Cerrar Sesión</span>}
        </button>
      </div>

      {/* Resize Handle - Only show when expanded */}
      {!isCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-secondary/50 transition-colors group"
          style={{ zIndex: 50 }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-secondary/30"></div>
        </div>
      )}
    </aside>
  )
}

DesktopNavigation.propTypes = {
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  onWidthChange: PropTypes.func,
}

export default DesktopNavigation
