import { useMemo, useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import { getDriveImageCandidates } from '../utils/driveImage';

function StaffMemberCard({ member }) {
  const { id, name, role, bio, photo, socialLinks, icon } = member;
  const hasPhoto = typeof photo === 'string' && photo.trim() !== '';

  // Multiple candidate URLs are tried in order (Drive embeds aren't 100%
  // reliable across all sharing configs), falling back to a generated
  // avatar if every candidate fails to load.
  const candidates = useMemo(
    () => (hasPhoto ? getDriveImageCandidates(photo) : []),
    [hasPhoto, photo]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=512`;
  const photoSrc = hasPhoto
    ? candidateIndex < candidates.length
      ? candidates[candidateIndex]
      : fallbackAvatar
    : null;

  const socialUrl =
    typeof socialLinks === 'string' && socialLinks.trim() !== ''
      ? socialLinks.startsWith('http')
        ? socialLinks
        : `https://${socialLinks}`
      : null;

  const socialHandle = (() => {
    if (!socialLinks) return '';
    const cleaned = socialLinks
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/^instagram\.com\//, '')
      .split('?')[0]
      .split('/')
      .filter(Boolean)
      .pop();
    if (!cleaned) return socialLinks;
    return cleaned.startsWith('@') ? cleaned : `@${cleaned}`;
  })();

  return (
    <article className="group flex flex-col bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-secondary transition-all card-hover flex flex-col h-[700px]" aria-labelledby={`staff-${id}-name`}>
      <div className="relative mb-0 rounded-none overflow-hidden shadow-none transition-all duration-500 group-hover:shadow-none group-hover:-translate-y-0 bg-surface-container-high h-[350px] shrink-0">
        {/*
          The 4:5 ratio box below uses the classic padding-percentage trick
          (padding-top: 125% = height/width) instead of the CSS `aspect-ratio`
          property. Old Android WebViews (pre-2021 roughly) don't support
          `aspect-ratio`, which collapses the box to 0 height with nothing
          else to size it — making the whole card invisible. The padding
          trick works on virtually every browser, including old ones.
        */}
        <div className="relative w-full" style={{ paddingTop: '125%' }}>
          {hasPhoto ? (
            <img
              src={photoSrc}
              data-photo-original={photo}
              alt={`Foto de ${name}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => {
                console.warn(
                  `[StaffMemberCard] Failed to load photo for "${name}". Original sheet value: "${photo}". Failed URL: "${photoSrc}".`
                );
                setCandidateIndex((prev) => prev + 1);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-8xl text-outline-variant opacity-30"
                aria-hidden="true"
              >
                {icon || 'person'}
              </span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 border-2 border-white/10 rounded-xl pointer-events-none"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div className="text-center mb-4">
          <p className="font-label-sm text-secondary uppercase tracking-widest font-bold mb-2 line-clamp-2">
            {role}
          </p>
          <h3
            id={`staff-${id}-name`}
            className="font-headline-md text-on-surface"
          >
            {name}
          </h3>
        </div>
        <p
          className="text-on-surface-variant font-body-md text-sm leading-relaxed opacity-90 relative overflow-y-auto custom-scrollbar max-h-[140px]"
        >
          {bio || 'Confirmación Pendiente'}
        </p>
        {socialUrl && (
          <a
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start bg-secondary text-on-secondary px-4 py-2 rounded-full font-label-sm text-label-sm uppercase font-bold tracking-wider hover:scale-105 transition-transform mt-0 min-w-0"
            aria-label={`Red social de ${name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span className="truncate">{socialHandle}</span>
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
