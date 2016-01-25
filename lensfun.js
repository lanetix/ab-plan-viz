'use strict';

const moment = require('moment')
const R = require("ramda")

const lensWhere = R.curry(
  (listLens, lensPredicate, structure) => R.pipe(
    R.view(listLens),
    (list) => {
      for (var i = 0; i < list.length; i++) {
        let lens = lensPredicate(list[i])
        if (lens === true) {
          return R.compose(listLens, R.lensIndex(i))
        } else if (R.type(lens) === 'Function') {
          return R.compose(listLens, R.lensIndex(i), lens)
        }
      }
      return undefined;
    }
  )(structure)
)

const defaultState = {
  speakers: [
    {
      name: 'Bjorn',
      speeches: [
        {
          'start': '2016-01-15T19:15:33-05:00',
          'end': '2016-01-15T19:35:44-05:00'
        }
      ],
      onStack: false,
      approved: true
    },
    {
      name: 'Bob',
      speeches: [
        {
          'start': '2016-01-15T19:15:33-05:00'
        },
        {
          'start': '2016-01-12T19:15:33-05:00',
          'end': '2016-01-12T19:35:44-05:00'
        }
      ],
      onStack: false,
      approved: true
    },
    {
      name: 'Sven',
      speeches: [{
        'start': '2016-01-15T19:15:13-05:00',
        'end': '2016-01-15T19:35:54-05:00'
      }, {
        'start': '2016-01-17T19:15:13-05:00',
        'end': '2016-01-17T19:35:14-05:00'
      }],
      onStack: false,
      approved: false
    }
  ]
}

const speaker = lensWhere(
  R.lensProp('speakers'),
  lensWhere(
    R.lensProp('speeches'),
    R.complement(R.has('end'))
  ),
  defaultState
)

console.log(
  JSON.stringify(R.over(speaker, R.assoc('end', moment().format()), defaultState), null, 2)
)
