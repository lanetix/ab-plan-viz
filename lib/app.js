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
import io from 'socket.io-client'

const store = window.store = createStore(reducer)

const App = React.createClass({
  render: function () {
    const { speakers, currentTime, mode } = this.props

    const hasFloor = R.pipe(
      R.prop('speeches'),
      R.any(R.complement(R.has('end')))
    )

    const withFloor = R.find(
      hasFloor
    )

    const mostFloorTime = R.reduce(
      (currentMax, speaker) => R.max(
        currentMax,
        speechesTotalDuration(currentTime, speaker.speeches)
      ), 0
    )

    const onStack = R.pipe(
        R.sortBy(R.pipe(
          R.prop('speeches'),
          speechesTotalDuration(currentTime)
        )),
        R.filter(R.prop('onStack')),
        R.filter(R.complement(hasFloor))
    )

    const speakerNodes = R.pipe(
      onStack,
      R.map((speaker) => {
        return (
          <SpeakerRow
            key={speaker.name}
            speaker={speaker}
            hasFloor={hasFloor(speaker)}
            currentTime={currentTime}
            maxFloorTime={mostFloorTime(speakers)}
            takeFloor={() => store.dispatch({type:'TAKE_FLOOR', speakerName: speaker.name, startTime: moment().format()})}
            />
        )
      })
    )(speakers)

    const participantNodes = R.pipe(
      R.filter(R.complement(R.prop('onStack'))),
      R.filter(R.complement(hasFloor)),
      R.map((speaker) => (
        <button type="button" className="btn btn-default participant" onClick={() => store.dispatch({type: 'GET_ON_STACK', speakerName: speaker.name})} key={speaker.name}>{speaker.name}</button>
      ))
    )(speakers)

    return (
      <div className="container">
        <div className="row">
          <div className='col-md-6'>
            <pre>{JSON.stringify(speakers, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }
})

const ConnectedApp = connect(
  R.identity,
  (dispatch) => ({})
)(App)

setInterval(function () {

  store.dispatch({type: 'TICK', currentTime: moment().format()})
}, 1000)

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>,
  document.getElementById('attach')
)
