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

    const speakerNodes = R.pipe(
      R.sortBy(R.pipe(
        R.prop('speeches'),
        speechesTotalDuration(currentTime)
      )),
      R.filter(R.prop('onStack')),
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
      R.map((speaker) => (
        <button type="button" className="btn btn-default participant" onClick={() => store.dispatch({type: 'GET_ON_STACK', speakerName: speaker.name})} key={speaker.name}>{speaker.name}</button>
      ))
    )(speakers)

    return (
      <div className="container">
        <div className="row">
          <div id='status' className='col-md-12 col-height'>
            <FloorStatus currentTime={currentTime} speaker={withFloor(speakers)}/>
          </div>
        </div>
        <div className="row">
          <div id='stack' className='col-md-8'>
            <table className='stack'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time on Floor</th>
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
  const action = {type: 'TICK', currentTime: moment().format()}
  store.dispatch(action)
}, 1000)

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('attach')
)
