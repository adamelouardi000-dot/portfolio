import { Reveal } from './Reveal'
import { DecryptText } from './DecryptText'

export function SectionHeading({ index, eyebrow, title, description }: {
  index: string; eyebrow: string; title: string; description?: string
}) {
  return <Reveal className="section-heading">
    <div className="eyebrow"><span className="section-number">{index}</span><span>{eyebrow}</span><span className="eyebrow-line" /></div>
    <h2><DecryptText text={title} /></h2>
    {description && <p>{description}</p>}
  </Reveal>
}

