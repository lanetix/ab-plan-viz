import R from 'ramda'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'

const defaultState = {
  currentTime: '2016-01-15T19:15:34-05:00',
  speakers: [
    {
      name: 'Bjorn',
      speeches: [
        {
          'start': '2015-01-15T20:00:00-05:00',
          'end': '2015-01-15T20:25:00-05:00'
        }
      ],
      onStack: false,
      approved: true
    },
    {
      name: 'Bob',
      speeches: [
        {
          'start': '2016-01-25T16:11:47-08:00'
        }
      ],
      onStack: false,
      approved: true
    },
    {
      name: 'Sven',
      speeches: [{
        'start': '2016-01-15T19:15:13-05:00',
        'end': '2016-01-15T19:16:13-05:00'
      }],
      onStack: false,
      approved: false
    }
  ]
}

module.exports = R.cond([
  [actionEq('USER_JOIN'), focusedReduce(
    () => R.lensProp('speakers'),
    (action) => R.concat([{
      name: action.name,
      speeches: [],
      onStack: false,
      approved: false
    }])
  )],
  [actionEq('CEDE_FLOOR'), focusedReduce(
    lensWhere(
      R.lensProp('speakers'),
      lensWhere(
        R.lensProp('speeches'),
        R.complement(R.has('end'))
      )
    ),
    (action) => R.assoc('end', action.endTime)
  )],
  [actionEq('TICK'), focusedReduce(
    () => R.lensProp('currentTime'),
    (action) => R.always(action.currentTime)
  )],
  [R.T, (state = defaultState, action) => state]
])
