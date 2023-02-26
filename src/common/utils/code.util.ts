import { v1 } from 'uuid'
import * as crypto from 'crypto'

const crcTable = (function () {
  let c
  let crcTable = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
    }
    crcTable[n] = c
  }
  return crcTable
})()

export class CodeUtil {

  static uuidV1(
    exceptHyphen: boolean = true,
  ): string {
    const uuid: string = v1({})
    return exceptHyphen
      ? uuid.replace(/-/g, '')
      : uuid
  }

  static generateBinary(length: number) {
    const characters = '01'
    const charactersLength = characters.length
    return Array
      .from({ length })
      .map(() => characters.charAt(Math.floor(Math.random() * charactersLength)))
      .join('')
  }

  static generateInt(): number {
    return Math.floor(Math.random() * 2 ** 32)
  }

  static generateNumberString(length: number) {
    const characters = '0123456789'
    const charactersLength = characters.length
    return Array
      .from({ length })
      .map(() => characters.charAt(Math.floor(Math.random() * charactersLength)))
      .join('')
  }

  static generateHex(length) {
    const characters = '0123456789ABCDEF'
    const charactersLength = characters.length

    return Array
      .from({ length })
      .map(() => characters.charAt(Math.floor(Math.random() * charactersLength)))
      .join('')
  }

  static generateCode(
    length,
    ignoreCase = true,
  ): string {
    const characters = ignoreCase
      ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length

    return Array
      .from({ length })
      .map(() => characters.charAt(Math.floor(Math.random() * charactersLength)))
      .join('')
  }


  static encrypt(
    text,
    key,
    iv,
  ) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let result = cipher.update(text, 'utf8', 'base64')
    result += cipher.final('base64')
    return result
  }

  static decrypt(
    text,
    key,
    iv,
  ) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let result = decipher.update(text, 'base64', 'utf8')
    result += decipher.final('utf8')
    return result
  }

  static crc32(text: string): number {
    if (!text) {
      return 0
    }
    let crc = 0 ^ (-1)

    for (let i = 0; i < text.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ text.charCodeAt(i)) & 0xFF]
    }

    return (crc ^ (-1)) >>> 0
  }
}