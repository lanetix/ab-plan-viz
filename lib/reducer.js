import { cond, T } from 'ramda'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'

const defaultState = {
  'chartEvents': [{
    'id': 1,
    'name': 'group 1',
    'collapse': false,
    'children': [{
      'id': 1,
      'name': 'ONE',
      'from': '2011-09-01T04:00:00.000Z',
      'to': '2017-09-12T04:00:00.000Z',
      'percent': 50
    }]
  }, {
    'id': 2,
    'name': 'group 2',
    'children': [{
      'id': 2,
      'name': 'TWO',
      'from': '2015-09-07T04:00:00.000Z',
      'to': '2015-09-10T04:00:00.000Z',
      'percent': 20
    }]
  }],
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
