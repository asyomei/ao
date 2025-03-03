import './JapaneseWotd.scss'
import type { JapaneseWordOfTheDay } from '#/backend/services/jpwotd'
import A from '../ui/A'
import Spoiler from '../ui/Spoiler'

export default function JapaneseWotd({
  data: { word, speechPart, sentence, url },
}: {
  data: JapaneseWordOfTheDay
}) {
  const trans = word.japanese !== word.kana ? `${word.kana}/${word.romaji}` : word.romaji

  return (
    <div class="jpwotd">
      <p>
        <A href={url}>{word.japanese}</A> [{trans}] - {word.english}
      </p>
      <p>part of speech: {speechPart}</p>
      <Spoiler class="sentence">
        <p>{sentence.japanese}</p>
        {sentence.japanese !== sentence.kana && <p>{sentence.kana}</p>}
        <p>{sentence.romaji}</p>
        <p>{sentence.english}</p>
      </Spoiler>
    </div>
  )
}
