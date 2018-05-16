import { TextDocument, TextEdit } from 'vscode-languageserver-types'
import {Chars} from './chars'
// const logger = require('../util/logger')('model-document')

export default class Doc {
  public doc: TextDocument
  public content: string
  public uri: string
  public filetype: string
  public version: number
  private chars: Chars
  constructor(uri: string, filetype: string, version: number, content: string, keywordOption: string) {
    this.doc = TextDocument.create(uri, filetype, version, content)
    this.uri = uri
    this.filetype = filetype
    this.content = content
    this.version = version
    let chars = this.chars = new Chars(keywordOption)
    chars.addKeyword('_')
    chars.addKeyword('-')
  }

  public applyEdits(edits: TextEdit[]):string {
    return TextDocument.applyEdits(this.doc, edits)
  }

  public setContent(content: string):void {
    this.content = content
    let version = this.version = this.version + 1
    this.doc = TextDocument.create(this.uri, this.filetype, version, content)
  }

  public isWord(word: string):boolean {
    return this.chars.isKeyword(word)
  }

  public getWords():string[] {
    let {content, chars} = this
    if (content.length == 0) return []
    let words = chars.matchKeywords(content)
    if (words.length < 10000) {
      for (let word of words) {
        for (let ch of ['-', '_']) {
          if (word.indexOf(ch) !== -1) {
            let parts = word.split(ch)
            for (let part of parts) {
              if (words.indexOf(part) === -1) {
                words.push(part)
              }
            }
          }
        }
      }
    }
    return words
  }
}
