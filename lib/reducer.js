import R from 'ramda'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'

const defaultState = {
  currentTime: '2016-01-15T19:15:34-05:00',
  speakers: [
    {
      name: 'Bjorn',
      speeches: [
      ],
      onStack: false,
      approved: true
    },
    {
      name: 'Bob',
      speeches: [],
      onStack: false,
      approved: true
    },
    {
      name: 'Sven',
      speeches: [],
      onStack: false,
      approved: false
    }
  ]
}

const activeSpeech = R.complement(R.has('end'))

const clearFloor = focusedReduce(
  (action, state) => lensWhere(
    R.lensProp('speakers'),
    lensWhere(
      R.lensProp('speeches'),
      activeSpeech
    )
  )(state),
  (action) => R.assoc('end', action.endTime)
)

const takeFloor = (state, action) => focusedReduce(
    (action, state) =>
    R.compose(
      lensWhere(
        R.lensProp('speakers'),
        R.propEq('name', action.speakerName)
      )(state),
      R.lensProp('speeches')
    ),
    (action) => R.concat([{start: action.startTime}])
  )(
    clearFloor(state, { endTime: action.startTime }),
    action
  )

module.exports = R.cond([
  [actionEq('CLEAR_FLOOR'), clearFloor],
  [actionEq('TAKE_FLOOR'), takeFloor],
  [actionEq('USER_JOIN'), focusedReduce(
    () => R.lensProp('speakers'),
    (action) => R.concat([{
      name: action.name,
      speeches: [],
      onStack: false,
      approved: false
    }])
  )],
  [actionEq('TICK'), focusedReduce(
    () => R.lensProp('currentTime'),
    (action) => R.always(action.currentTime)
  )],
  [R.T, (state = defaultState, action) => state]
])
