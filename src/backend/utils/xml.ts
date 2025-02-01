import { XMLParser } from 'fast-xml-parser'

export const xmlParser = new XMLParser({
  ignoreDeclaration: true,
  ignorePiTags: true,
})
