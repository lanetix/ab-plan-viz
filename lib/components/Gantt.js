import React from 'react'
import R from 'ramda'
import Gantt from 'gantt'

module.exports = React.createClass({
  render: function () {
    return (
      <div className='workflow-timeline'>
        <canvas id='root' />
      </div>
    )
  },
  componentDidMount: function () {
    const { chartEvents } = this.props

    const gantt = new Gantt('root', chartEvents, {
      barBgColor: '#2db7f5',
      barColor1: '#337ab7',
      barColor2: '#337ab7'
    })
    gantt.setType('week')
  }
})
