import { toRomaji } from 'wanakana'
import { z } from 'zod'
import { swr } from '../swr'
import { xmlParser } from '../utils/xml'

interface DescriptionStructure {
  speechPart: string
  sentence: {
    japanese: string
    kana: string
    romaji: string
    english: string
  }
}

export interface JapaneseWordOfTheDay extends DescriptionStructure {
  word: {
    japanese: string
    kana: string
    romaji: string
    english: string
  }
  date: Date
  url: string
}

const ResponseSchema = z.object({
  rss: z.object({
    channel: z.object({
      item: z.object({
        description: z.string(),
        link: z.string().url(),
        pubDate: z.coerce.date(),
        title: z.string(),
        'wotd:transliteratedWord': z.string(),
      }),
    }),
  }),
})

const te = <S extends string>(th: S) => z.object({ th: z.literal(th), td: z.string() })
const DescriptionSchema = z.object({
  table: z.object({
    tr: z.tuple([
      te('Part of speech:'),
      te('Example sentence:'),
      te('Sentence meaning:'),
      te('Yomigana word:'),
      te('Yomigana sentence:'),
    ]),
  }),
})

const RSS_URL = 'https://feeds.feedblitz.com/japanese-word-of-the-day&x=1'

async function fetchWordOfTheDay(): Promise<JapaneseWordOfTheDay> {
  const resp = await fetch(RSS_URL, {
    headers: {
      'user-agent': 'asyomei.org/1.0',
    },
  })
  const data = ResponseSchema.parse(xmlParser.parse(await resp.text()))
  const item = data.rss.channel.item
  const [japanese, english] = item.title.split(': ')
  return {
    word: {
      japanese,
      english,
      kana: item['wotd:transliteratedWord'],
      romaji: toRomaji(item['wotd:transliteratedWord']),
    },
    date: item.pubDate,
    url: item.link,
    ...parseDescription(item.description),
  }
}

export const fetchJpwotd = swr({
  fetcher: fetchWordOfTheDay,
  validate: ({ current }) => {
    if (!current) return 'refetch'
    return getDateString(new Date()) === getDateString(current.date) ? 'keep' : 'refetch'
  },
})

const getDateString = (date: Date) => {
  const str = date.toISOString()
  return str.slice(0, str.indexOf('T'))
}

const parseDescription = (descXml: string): DescriptionStructure => {
  const elems = DescriptionSchema.parse(xmlParser.parse(descXml)).table.tr
  return {
    speechPart: elems[0].td,
    sentence: {
      japanese: elems[1].td,
      english: elems[2].td,
      kana: elems[4].td,
      romaji: toRomaji(elems[4].td).replace(/(\W+)(\w)/g, '$1 $2'),
    },
  }
}
