import React from 'react'
import {duration} from '../time'
import R from 'ramda'

module.exports = React.createClass({
  render: function () {
    const { speaker, currentTime } = this.props

    const floorSpeech = R.pipe(
      R.prop('speeches'),
      R.find(R.complement(R.has('end')))
    )

    return speaker ? (
      <div className='floorSpeaker'>
        <h2>{speaker.name}</h2>
        <h4>has had the floor for {duration(floorSpeech(speaker).start, currentTime, 'seconds')} second(s)</h4>
      </div>
    ) : (
      <div className='floorSpeaker'>
        <h4>The floor is open.</h4>
      </div>
    )
  }
})
