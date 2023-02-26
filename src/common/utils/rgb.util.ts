export class RgbUtil {
  static rgbConvertToNumber(color: string): number {
    const rgba = color
      .replace(/^rgba?\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map(t => +t)
    const [r, g, b] = rgba.map(t => +t)
    const a = rgba[3] === undefined
      ? 100
      : (+rgba[3]) * 100

    return (r * (2 ** 24)) + (g * (2 ** 16)) + (b * (2 ** 8)) + a
  }

  static numberConvertToRgb(value: number): string {
    const red = Math.floor((value / (2 ** 24))) & 255
    const green = Math.floor((value / (2 ** 16))) & 255
    const blue = Math.floor((value / (2 ** 8))) & 255
    const opacity = Math.floor((value & (255))) / 100

    return opacity == 1
      ? `rgb(${red}, ${green}, ${blue})`
      : `rgba(${red}, ${green}, ${blue}, ${opacity})`
  }
}
