import React from 'react'
import { clone, map } from 'ramda'
import Gantt from 'gantt'
import moment from 'moment'

const mapDates = (f) => (chartEvents) =>
map(
  (chartEvent) => ({
    ...chartEvent,
    children: map(
      (child) => ({
        ...child,
        from: f(child.from),
        to: f(child.to)
      })
    )(chartEvent.children)
  })
)(chartEvents)

const ISOToJSDate = (iso) => moment(iso).toDate()
const covertDatesToDumbFormat = mapDates(ISOToJSDate)

module.exports = React.createClass({
  getInitialState: function () {
    return {
      gantt: null
    }
  },
  render: function () {
    if (this.state.gantt) {
      this.state.gantt.setData(covertDatesToDumbFormat(this.props.chartEvents))
    }
    return (
      <div className='workflow-timeline'>
        <canvas id='root' />
      </div>
    )
  },
  componentDidMount: function () {
    const { chartEvents } = this.props

    const gantt = new Gantt('root', covertDatesToDumbFormat(chartEvents), {
      barBgColor: '#2db7f5',
      barColor1: '#337ab7',
      barColor2: '#337ab7'
    })

    window.gantt = gantt
    this.setState({gantt})
    gantt.setType('week')
  }
})
