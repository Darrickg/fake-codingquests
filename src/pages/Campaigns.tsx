import { campaignCopy, campaigns } from '../content/catalog'
import { CampaignNotice } from '../components/catalog'
import { SectionHead } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function Campaigns() {
  useTitle('Campaign Board')
  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead as="h1" eyebrow="Campaign Board" title={campaignCopy.boardTitle} sub={campaignCopy.boardSub} />
      <div className="rounded-[16px] border border-hairline bg-[radial-gradient(120%_100%_at_50%_0%,#1f1912,#120f0c)] p-4 pt-8 shadow-[inset_0_2px_12px_rgba(0,0,0,.6)] md:p-8 md:pt-10">
        <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c, i) => (
            <li key={c.slug}>
              <CampaignNotice c={c} index={i} headingLevel={2} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
