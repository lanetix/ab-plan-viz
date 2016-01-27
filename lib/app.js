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
            <button type="button" className="btn btn-default participant">Carl</button>
            <button type="button" className="btn btn-default participant">Kayla</button>
            <button type="button" className="btn btn-default participant">William</button>
            <button type="button" className="btn btn-default participant">Norman</button>
            <button type="button" className="btn btn-default participant">Thomas</button>
            <button type="button" className="btn btn-default participant">Ruth</button>
            <button type="button" className="btn btn-default participant">Robert</button>
            <button type="button" className="btn btn-default participant">Ramona</button>
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
