import React from 'react'
import R from 'ramda'
import {speechDuration} from '../time.js'

module.exports = React.createClass({
  render: function () {
    const { speaker, maxFloorTime } = this.props

    const speechesTotalDuration = R.pipe(
      R.map(speechDuration),
      R.sum
    )
    const barStyle = {width: `${100 * speechesTotalDuration(speaker.speeches) / maxFloorTime}%`}

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
