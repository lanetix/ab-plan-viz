import React from 'react'
import ReactDOM from 'react-dom'
import R from 'ramda'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import FloorStatus from './components/FloorStatus'
import SpeakerRow from './components/SpeakerRow'
import {speechesTotalDuration} from './time'
import reducer from './reducer'
import moment from 'moment'

const store = window.store = createStore(reducer)

const App = React.createClass({
  render: function () {
    const { speakers, currentTime } = this.props

    const hasFloor = R.find(
      R.pipe(
        R.prop('speeches'),
        R.any(R.complement(R.has('end')))
      )
    )

    const mostFloorTime = R.reduce(
      (currentMax, speaker) => R.max(
        currentMax,
        speechesTotalDuration(currentTime, speaker.speeches)
      ), 0
    )

    const speakerNodes = R.pipe(
      R.sortBy(R.pipe(
        R.prop('speeches'),
        speechesTotalDuration(currentTime)
      )),
      R.map((speaker) => {
        return (
          <SpeakerRow
            key={speaker.name}
            speaker={speaker}
            currentTime={currentTime}
            maxFloorTime={mostFloorTime(speakers)}
            />
        )
      })
    )(speakers)

    return (
      <div>

        <FloorStatus currentTime={currentTime} speaker={hasFloor(speakers)}/>

        <pre>most floor time: {mostFloorTime(speakers)}</pre>

        <table className='stack'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Share of Total Time</th>
            </tr>
          </thead>
          <tbody>
            {speakerNodes}
          </tbody>
        </table>

        <pre>{JSON.stringify(this.props, null, 2)}</pre>

      </div>
    )
  }
})

const ConnectedApp = connect(
  R.identity,
  (dispatch) => ({})
)(App)

setInterval(function () {
  const action = {type: 'TICK', currentTime: moment().format()}
  store.dispatch(action)
}, 1000)

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('container')
)
