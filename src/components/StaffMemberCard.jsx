import { useMemo, useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import { getDriveImageCandidates } from '../utils/driveImage';

const MAX_BIO_PREVIEW = 120;

function StaffMemberCard({ member }) {
  const { id, name, role, bio, photo, socialLinks, icon } = member;
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const hasPhoto = typeof photo === 'string' && photo.trim() !== '';
  const shouldTruncate = (bio || '').length > MAX_BIO_PREVIEW;

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
    <article className="group flex flex-col" aria-labelledby={`staff-${id}-name`}>
      <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-secondary/20 group-hover:-translate-y-2 bg-surface-container-high">
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

      <div className="flex flex-col items-start">
        <span className="text-secondary font-label-sm tracking-[0.3em] uppercase font-bold mb-1">
          {role}
        </span>
        <h3
          id={`staff-${id}-name`}
          className="font-headline-md text-on-surface mb-2 tracking-tight"
        >
          {name}
        </h3>
        <p
          onClick={() => shouldTruncate && setIsBioExpanded(!isBioExpanded)}
          className={`text-on-surface-variant font-body-md leading-relaxed opacity-80 ${
            shouldTruncate ? 'cursor-pointer' : ''
          } ${shouldTruncate && !isBioExpanded ? 'mb-0 line-clamp-3' : 'mb-3'}`}
        >
          {bio || 'Confirmación Pendiente'}
        </p>
        {(socialUrl || shouldTruncate) && (
          <div
            className={`w-full flex items-center ${
              socialUrl ? 'justify-between' : 'justify-end'
            } ${shouldTruncate ? 'mt-3' : 'mt-0'}`}
          >
            {socialUrl && (
              <a
                href={socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-label-md hover:text-secondary transition-colors"
                aria-label={`Red social de ${name}`}
              >
                <span>{socialHandle}</span>
              </a>
            )}
            {shouldTruncate && (
              <button
                type="button"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="text-label-sm text-secondary uppercase font-bold tracking-widest hover:text-primary transition-colors"
              >
                {isBioExpanded ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
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
