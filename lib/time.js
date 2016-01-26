import moment from 'moment'
import R from 'ramda'

window.moment = moment // TODO

const duration = R.curry(
  (start, end, units) => moment(end).diff(moment(start), units)
)

const speechDuration = R.curry(
  (currentTime, speech) => duration(speech.start, R.propOr(currentTime, 'end')(speech), 'seconds')
)

const speechesTotalDuration = R.curry(
  (currentTime, speeches) => R.pipe(
    R.map(speechDuration(currentTime)),
    R.sum
  )(speeches)
)

module.exports = {
  duration: duration,
  speechDuration: speechDuration,
  speechesTotalDuration: speechesTotalDuration
}
