import React from 'react'
import ReactDOM from 'react-dom'
import R from 'ramda'
import moment from 'moment'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'

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

const currentSpeaker = (speakers) => {

}

const actionEq = R.curry(
  (type, state, action) => R.propEq('type', type, action)
)

const focusedReduce = R.curry(
  (lens, transform, state, action) => R.over(lens, transform(action), state)
)

const userJoin = focusedReduce(
  R.lensProp('speakers'),
  (action) => R.concat([{
    name: action.name,
    speeches: [],
    onStack: false,
    approved: false
  }])
)

const cedeFloor = (state, action) => {
  return state
}

const reducer = R.cond([
  [actionEq('USER_JOIN'), userJoin],
  [actionEq('CEDE_FLOOR'), cedeFloor],
  [R.T, (state = defaultState, action) => state]
])

const store = createStore(reducer)

window.store = store

// utility functions
const speechDuration = (speech) =>
speech.end ? moment(speech.end).diff(moment(speech.start), 'seconds') : 0

var speechesTotalDuration = R.pipe(
  R.map(speechDuration),
  R.sum
)

// components
const SpeakerRow = React.createClass({
  render: function () {
    const { speaker, maxFloorTime } = this.props

    const speechesTotalDuration = R.pipe(
      R.map(speechDuration),
      R.sum
    )
    const barStyle = {width: `${100 * speechesTotalDuration(speaker.speeches) / maxFloorTime}%`}

    return (
      <tr className='speaker' key={speaker.name}>
      <td>{speaker.name}</td>
      <td>
      <div className='bar' style={barStyle}>&nbsp;</div>
      </td>
      </tr>
    )
  }
})

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

      <div className='floorSpeaker'>
      <h2>{hasFloor(speakers).name}</h2>
      <h4>has the floor</h4>
      </div>

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
