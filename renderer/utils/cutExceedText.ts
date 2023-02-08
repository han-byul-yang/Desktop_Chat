const cutExceedText = (text: string | undefined, maxLength = 40) => {
  if (text) {
    if (text.length > maxLength) {
      const cutText = text.slice(0, maxLength)
      return `${cutText} ...`
    }
  }
  return text
}

export default cutExceedText
