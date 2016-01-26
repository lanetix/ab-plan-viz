import React from 'react'
import R from 'ramda'
import { speechDuration, speechesTotalDuration } from '../time.js'

module.exports = React.createClass({
  render: function () {
    const { speaker, maxFloorTime, currentTime } = this.props

    const barStyle = {width: `${100 * speechesTotalDuration(currentTime, speaker.speeches) / maxFloorTime}%`}
    
    return (
      <tr className='speaker' key={speaker.name}>
        <td>{speaker.name}</td>
        <td>
          <div className='bar' style={barStyle}>&nbsp;</div>
        </td>
      </tr>
    )
  }
})
