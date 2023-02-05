// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs'

const days = ['일', '월', '화', '수', '목', '금', '토']

const dateFormat = (millisecondes: string) => {
  return dayjs(millisecondes, 'd, DD MM YYYY HH:mm:ss GMT')
}

export const nightDayTime = (millisecondes: string) => {
  const createDate = dateFormat(millisecondes)

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

export const organizedTime = (millisecondes: string) => {
  const nowDate = dayjs()
  const nowDateFormat = dayjs(nowDate.format(), 'YYYY-MM-DDTHH:mm:ss+SSS')
  const createDate = dateFormat(millisecondes)

  if (createDate.format('YYYY MM DD') !== nowDateFormat.format('YYYY MM DD')) {
    if (nowDateFormat.diff(createDate, 'year')) return createDate.format('YYYY년 MM월 DD일')
    if (nowDateFormat.diff(createDate, 'day') >= 2) {
      return createDate.format('MM월 DD일')
    }
    return '어제'
  }

  const sameDayNightDayTime = nightDayTime(millisecondes)

  return sameDayNightDayTime
}

export const checkNewDayStart = (prevMillisecondes: string, millisecondes: string) => {
  const prevDate = dateFormat(prevMillisecondes)
  const createDate = dateFormat(millisecondes)
  const day = days[createDate.day()]

  if (createDate.format('YYYY MM DD') !== prevDate.format('YYYY MM DD')) {
    return createDate.format(`YYYY년 MM월 DD일 ${day}요일`)
  }
  return undefined
}

export const firstDay = (millisecondes: string) => {
  const createDate = dateFormat(millisecondes)
  const day = days[createDate.day()]

  return createDate.format(`YYYY년 MM월 DD일 ${day}요일`)
}
