import './JapaneseWotd.scss'
import type { JapaneseWordOfTheDay } from '#/backend/jpwotd'
import A from './A'
import Spoiler from './Spoiler'

export default function JapaneseWotd({
  data: { word, speechPart, sentence, url },
}: {
  data: JapaneseWordOfTheDay
}) {
  const trans = word.japanese !== word.kana ? `${word.kana}/${word.romaji}` : word.romaji
  const htmlSentence = {
    japanese: mark(sentence.japanese, word.japanese),
    kana: mark(sentence.kana, word.kana),
    romaji: mark(sentence.romaji, word.romaji),
    english: mark(sentence.english, word.english),
  }

  return (
    <div class="jpwotd">
      <p>
        <A href={url}>{word.japanese}</A> [{trans}] - {word.english}
      </p>
      <p>part of speech: {speechPart}</p>
      <Spoiler class="sentence">
        <p innerHTML={htmlSentence.japanese} />
        {sentence.japanese !== sentence.kana && <p innerHTML={htmlSentence.kana} />}
        <p innerHTML={htmlSentence.romaji} />
        <p innerHTML={htmlSentence.english} />
      </Spoiler>
    </div>
  )
}

const mark = (sentence: string, word: string) => sentence.replaceAll(word, `<b>${word}</b>`)
