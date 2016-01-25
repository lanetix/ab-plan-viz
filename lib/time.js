import moment from 'moment'
import R from 'ramda'

const speechDuration = (speech) =>
speech.end ? moment(speech.end).diff(moment(speech.start), 'seconds') : 0

const speechesTotalDuration = R.pipe(
  R.map(speechDuration),
  R.sum
)

module.exports = {
  speechDuration: speechDuration,
  speechesTotalDuration: speechesTotalDuration
}
