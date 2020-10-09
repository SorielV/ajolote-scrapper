interface ISanitizeOptions {
    removeLineBreaks?: boolean,
    removeWhiteSpaces?: boolean
}
export const sanitize = (str: string, options: ISanitizeOptions = { removeLineBreaks: true, removeWhiteSpaces: true }) => {
  let s = str.trim()
  if (options.removeWhiteSpaces) {
    s = s.replace(/[ ]{2,}/g, ' ')
  }
  if (options.removeLineBreaks) {
    s = s.replace(/\n/g, '')
  }

  return s
}

export const sanitizeURL = (str: string) => str.replace(/(^:)[//]/g, '/')
