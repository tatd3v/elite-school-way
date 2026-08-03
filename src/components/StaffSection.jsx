import { staffMembers } from '../data/staff'
import StaffMemberCard from './StaffMemberCard'

export default function StaffSection() {
  return (
    <section
      className="py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto"
      id="staff"
      aria-labelledby="staff-heading"
    >
      <div className="text-center mb-20">
        <h2
          id="staff-heading"
          className="font-headline-lg text-headline-lg text-primary uppercase inline-block relative pb-4"
        >
          EL CLAUSTRO DOCENTE
          <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-secondary"></span>
        </h2>
        <p className="text-on-surface-variant mt-6 max-w-xl mx-auto">
          Seleccionados por su excelencia y trayectoria académica en la escena Ballroom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {staffMembers.map((member) => (
          <StaffMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}
