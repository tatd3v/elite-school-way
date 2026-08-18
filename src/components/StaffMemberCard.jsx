import PropTypes from 'prop-types';

function StaffMemberCard({ member }) {
  const { id, name, role, bio, photo, socialLinks, icon } = member;
  const hasPhoto = typeof photo === 'string' && photo.trim() !== '';

  const socialUrl =
    typeof socialLinks === 'string' && socialLinks.trim() !== ''
      ? socialLinks.startsWith('http')
        ? socialLinks
        : `https://${socialLinks}`
      : null;

  return (
    <article
      className="group bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all"
      aria-labelledby={`staff-${id}-name`}
    >
      <div className="h-[400px] bg-surface-container-high flex items-center justify-center relative overflow-hidden">
        {hasPhoto ? (
          <img
            src={photo}
            alt={`Foto de ${name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span
            className="material-symbols-outlined text-8xl text-outline-variant opacity-30"
            aria-hidden="true"
          >
            {icon || 'person'}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
          <span className="font-body-md text-body-md text-secondary font-bold line-clamp-3">
            {bio || 'Confirmación Pendiente'}
          </span>
        </div>
      </div>
      <div className="p-8 text-center">
        <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold mb-2">
          {role}
        </p>
        <h3
          id={`staff-${id}-name`}
          className="font-headline-md text-headline-md text-on-surface mb-3"
        >
          {name}
        </h3>
        {socialUrl && (
          <a
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 text-outline hover:text-secondary transition-colors text-sm"
            aria-label={`Red social de ${name}`}
          >
            <span className="material-symbols-outlined text-base">link</span>
            <span className="truncate max-w-[200px]">{socialLinks}</span>
          </a>
        )}
      </div>
    </article>
  );
}

StaffMemberCard.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    bio: PropTypes.string,
    photo: PropTypes.string,
    socialLinks: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
};

export default StaffMemberCard;
