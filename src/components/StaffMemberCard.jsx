import PropTypes from 'prop-types'

export default function StaffMemberCard({ member }) {
  return (
    <article
      className="group bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all"
      aria-labelledby={`staff-${member.id}-name`}
    >
      <div className="h-[400px] bg-surface-container-high flex items-center justify-center relative overflow-hidden">
        <span
          className="material-symbols-outlined text-8xl text-outline-variant opacity-30"
          aria-hidden="true"
        >
          {member.icon}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
          <span className="font-body-md text-body-md text-secondary font-bold">
            Confirmación Pendiente
          </span>
        </div>
      </div>
      <div className="p-8 text-center">
        <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold mb-2">
          {member.title}
        </p>
        <h3
          id={`staff-${member.id}-name`}
          className="font-headline-md text-headline-md text-on-surface"
        >
          {member.placeholderText}
        </h3>
      </div>
    </article>
  )
}

StaffMemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    placeholderText: PropTypes.string.isRequired
  }).isRequired
}
