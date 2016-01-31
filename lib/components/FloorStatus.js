import React from 'react'
import {duration} from '../time'
import R from 'ramda'

module.exports = React.createClass({
  render: function () {
    const { speaker, currentTime, nextSpeaker } = this.props

    const floorSpeech = R.pipe(
      R.prop('speeches'),
      R.find(R.complement(R.has('end')))
    )

    const nextButton = nextSpeaker ?
    (<button type="button" className="btn btn-danger participant" onClick={() => store.dispatch({type: 'TAKE_FLOOR', speakerName: nextSpeaker.name, startTime: currentTime })}>Next Speaker</button>) :
    ''

    return speaker ? (
      <div className='floorSpeaker'>
        <h2>{speaker.name}</h2>
        <h4>has had the floor for {duration(floorSpeech(speaker).start, currentTime, 'seconds')} second(s)</h4>
        <button type="button" className="btn btn-danger participant" onClick={() => store.dispatch({type: 'CLEAR_FLOOR', endTime: currentTime })} key={speaker.name}>End Speech</button>
        {nextButton}
      </div>
    ) : (
      <div className='floorSpeaker'>
        <h4>The floor is open.</h4>
      </div>
    )
  }
})
