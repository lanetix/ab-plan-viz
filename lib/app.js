import React from 'react'
import ReactDOM from 'react-dom'
import R from 'ramda'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import { lensWhere, actionEq, focusedReduce } from './reducerHelpers'
import FloorStatus from './components/FloorStatus'
import SpeakerRow from './components/SpeakerRow'
import {speechesTotalDuration} from './time.js'

// sample data

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

const userJoin = focusedReduce(
  () => R.lensProp('speakers'),
  (action) => R.concat([{
    name: action.name,
    speeches: [],
    onStack: false,
    approved: false
  }])
)

const cedeFloor = focusedReduce(
  lensWhere(
    R.lensProp('speakers'),
    lensWhere(
      R.lensProp('speeches'),
      R.complement(R.has('end'))
    )
  ),
  (action) => R.assoc('end', action.endTime)
)

const reducer = R.cond([
  [actionEq('USER_JOIN'), userJoin],
  [actionEq('CEDE_FLOOR'), cedeFloor],
  [R.T, (state = defaultState, action) => state]
])

const store = window.store = createStore(reducer)

const App = React.createClass({
  render: function () {
    const { speakers } = this.props

    const hasFloor = R.find(
      R.pipe(
        R.prop('speeches'),
        R.any(R.complement(R.has('end')))
      )
    )

    const mostFloorTime = R.reduce(
      (currentMax, speaker) => R.max(
        currentMax,
        speechesTotalDuration(speaker.speeches)
      ), 0
    )

    const speakerNodes = speakers.map(
      function (speaker) {
        return <SpeakerRow
          key={speaker.name}
          speaker={speaker}
          maxFloorTime={mostFloorTime(speakers)}
          />
      }
    )

    return (
      <div>

        <FloorStatus speaker={hasFloor(speakers)}/>

        <table className='stack'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Speaking Time</th>
            </tr>
          </thead>
          <tbody>
            {speakerNodes}
          </tbody>
        </table>

        <pre>{JSON.stringify(speakers, null, 2)}</pre>

      </div>
    )
  }
})

const ConnectedApp = connect(
  R.identity,
  (dispatch) => ({})
)(App)

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('container')
)
