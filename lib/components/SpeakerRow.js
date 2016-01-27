import React from 'react'
import R from 'ramda'
import { speechDuration, speechesTotalDuration } from '../time.js'

module.exports = React.createClass({
  render: function () {
    const { speaker, maxFloorTime, currentTime, takeFloor, hasFloor } = this.props

    const barStyle = {width: `${100 * speechesTotalDuration(currentTime, speaker.speeches) / maxFloorTime}%`}

    const classes = hasFloor ? 'speaker hasFloor' : 'speaker'

    return (
      <tr className={classes} key={speaker.name}>
        <td><a className="btn btn-primary" href="#" role="button" href="#" onClick={takeFloor}>{speaker.name}</a></td>
        <td className='barCell'>
          <div className='bar' style={barStyle}>&nbsp;</div>
        </td>
      </tr>
    )
  }
})
