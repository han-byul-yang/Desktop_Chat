// eslint-disable-next-line import/no-extraneous-dependencies
import { Fragment } from 'react'

const manageLineChange = (text: string) => {
  const parsedText = text.split(/\n/g).map((splitText, index) => {
    const splitTextKey = `splitText-${index}`

    return (
      <Fragment key={splitTextKey}>
        {splitText}
        <br />
      </Fragment>
    )
  })
  return parsedText
}

export default manageLineChange
