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
import { hasFloor, withFloor, mostFloorTime, onStack } from './speakerUtils'

const store = window.store = createStore(reducer)

const App = React.createClass({
  render: function () {
    const { speakers, currentTime } = this.props

    const speakerNodes = R.pipe(
      onStack,
      R.map((speaker) => {
        return (
          <SpeakerRow
            key={speaker.name}
            speaker={speaker}
            hasFloor={hasFloor(speaker)}
            currentTime={currentTime}
            maxFloorTime={mostFloorTime(speakers, currentTime)}
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
          <div id='status' className='col-md-12 col-height'>
            <FloorStatus currentTime={currentTime} speaker={withFloor(speakers)} nextSpeaker={R.head(onStack(speakers))}/>
          </div>
        </div>
        <div className="row">
          <div id='stack' className='col-md-8'>
            <table className='stack'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time on Floor</th>
                  <th>Speeches</th>
                </tr>
              </thead>
              <tbody>
                {speakerNodes}
              </tbody>
            </table>
          </div>
          <div id="participants" className='col-md-4'>
            {participantNodes}
          </div>
        </div>
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
