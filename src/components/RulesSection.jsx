import DressCode from './DressCode'
import CodeOfConduct from './CodeOfConduct'
import { dressCodes } from '../data/dressCodes'
import { conductRules, elitePledge } from '../data/conductRules'

export default function RulesSection() {
  return (
    <section
      className="py-12 md:py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-background"
      aria-labelledby="rules-heading"
    >
      <div className="grid grid-cols-1 gap-16">
        {/* scroll-mt-20 keeps each anchor's title clear of the fixed header
            (h-16) when jumped to directly from the nav menu. */}
        <div id="dresscode" className="scroll-mt-20">
          <DressCode dressCodes={dressCodes} />
        </div>
        <div id="rules" className="scroll-mt-20">
          <CodeOfConduct rules={conductRules} pledge={elitePledge} />
        </div>
      </div>
    </section>
  );
}
