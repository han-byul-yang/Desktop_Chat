// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs'

const organizedTime = (millisecondes: string) => {
  const nowDate = dayjs()
  const nowDateFormat = dayjs(nowDate.format(), 'YYYY-MM-DDTHH:mm:ss+SSS')
  const createDate = dayjs(millisecondes, 'd, DD MM YYYY HH:mm:ss GMT')

  if (createDate.format('YYYY MM DD') !== nowDateFormat.format('YYYY MM DD')) {
    if (nowDateFormat.diff(createDate, 'year')) return createDate.format('YYYY년 MM월 DD일')
    if (nowDateFormat.diff(createDate, 'day') >= 2) {
      return createDate.format('MM월 DD일')
    }
    return '어제'
  }

  if (createDate.hour() > 0 && createDate.hour() < 12) {
    return `오전 ${createDate.format('h:mm')}`
  }
  if (createDate.hour() === 12) {
    return `오후 ${createDate.format('hh:mm')}`
  }
  if (createDate.hour() === 0) {
    return `오전 ${createDate.format('hh:mm')}`
  }
  return `오후 ${createDate.format('h:mm')}`
}

export default organizedTime
