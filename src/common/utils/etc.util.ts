export class EtcUtil {

  static encodeBase64(text: string) {
    return Buffer
      .from(text)
      .toString('base64')
  }


}