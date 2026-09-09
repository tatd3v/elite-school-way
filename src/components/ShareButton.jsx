import { useEffect, useRef, useState } from 'preact/hooks'
import PropTypes from 'prop-types'

const COPIED_FEEDBACK_MS = 1600

/**
 * Small circular "share" button pinned to the top-right corner of a
 * section, letting visitors share a direct link to that section
 * (e.g. tusitio.com/#categories) via the Web Share API, falling back to
 * clipboard copy (with a temporary checkmark confirmation) and finally a
 * prompt(). Same 40x40 glassmorphism style/position on mobile and desktop,
 * for both the light and dark theme — the light/dark color swap comes for
 * free from the shared `text-primary`/`border-secondary` etc. tokens, which
 * are already re-pointed per theme via the `.dark` overrides in index.css.
 *
 * Renders with `position: absolute`, so its nearest ancestor with
 * `position: relative` (added at each call site) must wrap the whole
 * section/card the button should be anchored to.
 */
export default function ShareButton({ label, sectionId, className = '' }) {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const showCopiedFeedback = () => {
    setIsCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`
    const shareData = {
      title: `Elite Way School — ${label}`,
      text: `Mira los detalles oficiales de ${label} en Elite Way School Ballroom 2026.`,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User cancelled or the native share sheet failed — fall back to
        // copying the link instead of doing nothing.
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        showCopiedFeedback()
        return
      } catch {
        // Fall through to the prompt fallback below.
      }
    }

    window.prompt('Copia el link:', url)
  }

  return (
    <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-10 ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Compartir ${label}`}
        title="Compartir sección"
        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-95 shadow-sm group ${
          isCopied
            ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-500 dark:text-emerald-300'
            : 'text-primary bg-primary/[0.04] border border-primary/20 hover:bg-primary/[0.08] hover:border-secondary hover:text-secondary dark:text-on-surface-variant dark:bg-white/5 dark:border-white/15 dark:hover:bg-white/15'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110">
          {isCopied ? 'check' : 'share'}
        </span>
      </button>
    </div>
  )
}

ShareButton.propTypes = {
  label: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  className: PropTypes.string,
}
