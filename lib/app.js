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
    return (
      <div className="foo">
        <div className="row">
          <div className='col-md-6'>
            <textarea value={JSON.stringify(this.props, null, 2)} onChange={ (event) =>  { console.log(`newState: ${JSON.stringify(event.target.value)}`); return store.dispatch({type: 'SET_STATE', newState: JSON.parse(event.target.value) || null }) } }/>
          </div>
          <div className='col-md-6'>
            <pre>{JSON.stringify(this.props, null, 2)}</pre>
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

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>,
  document.getElementById('attach')
)
