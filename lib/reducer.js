import { cond, T } from 'ramda'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'

const defaultState = {
  'plan': {
    'earlyStart': true,
    'stages': [
      {
        'name': 'Only',
        'streams': [
          {
            'earlyStart': true,
            'tasks': [
              {
                'name': 'A',
                'duration': 2,
                'buffer': 2
              },
              {
                'name': 'B',
                'duration': 2,
                'buffer': 0
              },
              {
                'name': 'C',
                'duration': 2,
                'buffer': 0
              }
            ]
          },
          {
            'earlyStart': true,
            'tasks': [
              {
                'name': 'Q',
                'duration': 15,
                'buffer': 0
              }
            ]
          }
        ]
      }
    ]
  },
  'ruleDict': { 'tasks': [] },
  'pegDate': '2016-01-01T00:00:00.000Z',
  'survey': {}
}

module.exports = cond([
  [actionEq('SET_STATE'), (state, action) => action.newState],
  [T, (state = defaultState, action) => state]
])
