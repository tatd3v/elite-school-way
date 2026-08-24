import DressCode from './DressCode'
import CodeOfConduct from './CodeOfConduct'
import { dressCodes } from '../data/dressCodes'
import { conductRules, elitePledge } from '../data/conductRules'

export default function RulesSection() {
  return (
    <section
      className="py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-background"
      id="rules"
      aria-labelledby="rules-heading"
    >
      <div className="grid grid-cols-1 gap-16">
        <DressCode dressCodes={dressCodes} />
        <CodeOfConduct rules={conductRules} pledge={elitePledge} />
      </div>
    </section>
  );
}
