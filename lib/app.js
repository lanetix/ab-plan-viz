import React from 'react'
import ReactDOM from 'react-dom'
import R from 'ramda'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import Gantt from './components/Gantt'
import SpeakerRow from './components/SpeakerRow'
import {speechesTotalDuration} from './time'
import reducer from './reducer'
import moment from 'moment'
import io from 'socket.io-client'
import { generatePlan } from '@lanetix/ab-plan'

const store = window.store = createStore(reducer)

const App = React.createClass({
  render: function () {
    const dispatchSetState = (event) => store.dispatch(
      {
        type: 'SET_STATE',
        newState: JSON.parse(event.target.value)
      }
    )

    const { plan, ruleDict, pegDate, survey } = this.props

    const chartEvents = [{
      id: 1,
      name: 'group 1',
      collapse: false,
      children: [{
        id: 1,
        name: 'task 1',
        from: new Date('2015-09-01 00:00:00'),
        to: new Date('2017-09-12 00:00:00'),
        percent: 50
      }]
    }, {
      id: 2,
      name: 'group 2',
      children: [{
        id: 2,
        name: 'task 2',
        from: new Date('2015-09-07 00:00:00'),
        to: new Date('2015-9-10 00:00:00'),
        percent: 20
      }]
    }]

    return (
      <div className="foo">
        <div className="row">
          <div className='col-md-2'>
            <textarea value={JSON.stringify(this.props, null, 2)} onChange={dispatchSetState}/>
          </div>
          <div className='col-md-10'>
            <pre>{JSON.stringify(generatePlan(plan, ruleDict, pegDate, survey), null, 2)}</pre>
            <Gantt chartEvents={chartEvents}/>
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
