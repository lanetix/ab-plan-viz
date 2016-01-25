import React from 'react'

module.exports = React.createClass({
  render: function () {
    const speaker = this.props.speaker

    return speaker ? (
      <div className='floorSpeaker'>
        <h2>{speaker.name}</h2>
        <h4>has the floor</h4>
      </div>
    ) : (
      <div className='floorSpeaker'>
        <h4>The floor is open.</h4>
      </div>
    )
  }
})
