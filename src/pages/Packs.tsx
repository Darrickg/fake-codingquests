import { packs, voteCopy } from '../content/packs'
import { BundleCard, PackCard, PackCreditNote, VoteBoard } from '../components/commerce'
import { Pin } from '../components/Pin'
import { SectionHead } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function Packs() {
  useTitle('Quest Packs')
  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead
        as="h1"
        eyebrow="Quest Packs"
        title="One topic. One payment."
        sub="Each pack bundles the quests for one game system, with their Godot project files. Buy it once and it stays yours, whether or not you ever join."
        pin={<Pin id="packs-page" />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {packs.map((p) => (
          <PackCard key={p.slug} pack={p} headingLevel={2} />
        ))}
      </div>
      <div className="mt-8">
        <BundleCard />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[12px] border border-hairline bg-surface p-4 md:p-5">
        <PackCreditNote className="min-w-0 flex-1" />
        <Pin id="pack-credit" />
      </div>

      <section id="vote" className="mt-16 scroll-mt-24 md:mt-24" aria-labelledby="vote-title">
        <SectionHead id="vote-title" eyebrow="Ask the members" title={voteCopy.title} sub={voteCopy.sub} pin={<Pin id="vote-board" />} />
        <VoteBoard />
      </section>
    </div>
  )
}
