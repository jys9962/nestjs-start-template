export namespace ValidatorUtil {
  export const isContainKorean = (value: string): boolean => {
    return /[ㄱ-힣]/.test(value)
  }

  export const isContainEnglish = (value: string) => {
    return /[a-zA-Z]/.test(value)
  }

  export const isContainNumber = (value: string) => {
    return /[0-9]/.test(value)
  }

  export const isContainSpecialCharacter = (value: string) => {
    return /[~!@#$%^&*()\-_=+]/.test(value)
  }

  export const isEmail = (value) => {
    return /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(value)
  }

  export const isPhone = (value: any) => {
    return /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/
      .test(value)
  }

  export const isNumber = (value) => {
    return /^[0-9]*$/.test(value)
  }

  export const isKorean = (value) => {
    return /^[가-힣0-9]*$/.test(value)
  }

  export const isEnglish = (value) => {
    return /^[A-Za-z0-9]*$/.test(value)
  }
}