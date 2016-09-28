import { cond, T, assoc } from 'ramda'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'

const defaultState = {
  'plan': {
    'stages': [
      {
        'name': 'Overall',
        'streams': [
          {
            'tasks': [
              {
                'buffer': 0,
                'duration': 7,
                'name': 'Decide on Launch Flavors'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 49,
                'duration': 28,
                'name': 'Stage Gate 1'
              },
              {
                'buffer': 0,
                'duration': 35,
                'name': 'Stage Gate 2'
              },
              {
                'buffer': 0,
                'duration': 28,
                'name': 'Stage Gate 3'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 7,
                'duration': 14,
                'name': 'Brewing and Tasting Preliminaries'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'Tastings & Recipe Lock'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'Prepare & Submit SOPs'
              },
              {
                'buffer': -7,
                'duration': 21,
                'name': 'Flavor Ordering'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'R3P Brewing & Packaging'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'Shipping for Testing'
              },
              {
                'buffer': -7,
                'duration': 35,
                'name': 'Consumer Testing'
              },
              {
                'buffer': -7,
                'duration': 14,
                'name': 'Top Line Report & Liquid Decision'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 35,
                'duration': 63,
                'name': 'Regulatory - Submit SOP'
              },
              {
                'buffer': 0,
                'duration': 42,
                'name': 'TTB Approval'
              },
              {
                'buffer': 0,
                'duration': 56,
                'name': 'State Approvals'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 70,
                'duration': 105,
                'name': 'Final Art Submitted'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'Packaging Available in Brewery'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 119,
                'duration': 56,
                'name': 'Flavors & Ingredients Available in Brewery'
              },
              {
                'buffer': -14,
                'duration': 28,
                'name': 'Brewing Production'
              },
              {
                'buffer': -7,
                'duration': 14,
                'name': 'Packaging in Brewery'
              }
            ],
            'earlyStart': false
          },
          {
            'tasks': [
              {
                'buffer': 196,
                'duration': 35,
                'name': 'Logistics'
              },
              {
                'buffer': 0,
                'duration': 7,
                'name': 'STR'
              }
            ],
            'earlyStart': false
          }
        ]
      }
    ],
    'earlyStart': false
  },
  'surveyFields': [
    {
      'description': 'Do flavors need to be ordered?',
      'name': 'flavor_ordering'
    },
    {
      'description': 'Is packaging going to be hard?',
      'name': 'packaging_hard'
    }
  ],
  'ruleDict': {
    'tasks': [
      {
        'name': 'Flavor Ordering',
        'rules': [
          {
            'surveyPattern': {
              'flavor_ordering': true
            },
            'patch': {
              'buffer': 7,
              'duration': 40
            }
          },
          {
            'surveyPattern': {
              'flavor_ordering': false
            },
            'patch': {
              'delete': true
            }
          }
        ]
      },
      {
        'name': 'Stage Gate 1',
        'rules': [
          {
            'surveyPattern': {
              'flavor_ordering': null
            },
            'patch': {
              'delete': true
            }
          }
        ]
      }
    ]
  },
  'pegDate': '2016-01-01T00:00:00.000Z',
  'survey': {
    'flavor_ordering': true
  }
}

module.exports = cond([
  [actionEq('SET_STATE'), (state, action) => action.newState],
  [actionEq('TOGGLE_SURVEY'), (state, action) => ({
    ...state,
    survey: assoc(action.fieldName, !state.survey[action.fieldName], state.survey)
  })],
  [T, (state = defaultState, action) => state]
])
