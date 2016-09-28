import React from 'react'
import ReactDOM from 'react-dom'
import { map, addIndex, identity, filter } from 'ramda'
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

const generateGantt = (scheduledEvents) =>
([
  {
    id: 1,
    name: 'Overall',
    collapse: false,
    children: addIndex(map)(
      (scheduledEvent, i) => ({
        id: i,
        name: scheduledEvent.taskName,
        from: scheduledEvent.body.start,
        to: scheduledEvent.body.end,
        percent: 100
      })
    )(filter(
      ({ patchType }) => patchType === 'timing',
      scheduledEvents
    ))
  }
])

const App = React.createClass({
  render: function () {
    const dispatchSetState = (event) => store.dispatch(
      {
        type: 'SET_STATE',
        newState: JSON.parse(event.target.value)
      }
    )

    const { plan, ruleDict, pegDate, survey, chartEvents } = this.props
    const scheduledEvents = generatePlan(plan, ruleDict, pegDate, survey)

    return (
      <div className="foo">
        <div className="row">
          <div className='col-md-2'>
            <textarea value={JSON.stringify(this.props, null, 2)} onChange={dispatchSetState}/>
          </div>
          <div className='col-md-10'>
            <Gantt chartEvents={generateGantt(scheduledEvents)}/>
            <pre>{JSON.stringify(scheduledEvents, null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  }
})

const ConnectedApp = connect(
  identity,
  (dispatch) => ({})
)(App)

// attach
ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp/>
  </Provider>,
  document.getElementById('attach')
)
