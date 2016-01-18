const React = require('react')
const ReactDOM = require('react-dom')
const R = require('ramda')
const moment = require('moment')

// sample data
const speakers = [
  {
    name: 'Bjorn',
    speeches: [
      {
        'start': '2016-01-15T19:15:33-05:00',
        'end': '2016-01-15T19:35:44-05:00'
      }
    ],
    onStack: false,
    approved: true
  },
  {
    name: 'Bob',
    speeches: [
      {
        'start': '2016-01-15T19:15:33-05:00'
      },
      {
        'start': '2016-01-12T19:15:33-05:00',
        'end': '2016-01-12T19:35:44-05:00'
      }
    ],
    onStack: false,
    approved: true
  },
  {
    name: 'Sven',
    speeches: [{
      'start': '2016-01-15T19:15:13-05:00',
      'end': '2016-01-15T19:35:54-05:00'
    }, {
      'start': '2016-01-17T19:15:13-05:00',
      'end': '2016-01-17T19:35:14-05:00'
    }],
    onStack: false,
    approved: false
  }
]

// utility functions
const speechDuration = (speech) => speech.end ? moment(speech.end).diff(moment(speech.start), 'seconds') : 0

var speechesTotalDuration = R.pipe(
  R.map(speechDuration),
  R.sum
)

// components
const SpeakerRow = React.createClass({
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

const App = React.createClass({
  render: function () {
    const { speakers } = this.props

    const hasFloor = R.find(
      R.pipe(
        R.prop('speeches'),
        R.any(R.complement(R.has('end')))
      )
    )

    const mostFloorTime = R.reduce(
      (currentMax, speaker) => R.max(
        currentMax,
        speechesTotalDuration(speaker.speeches)
      ), 0
    )

    console.log('mostFloorTime(speakers)', mostFloorTime(speakers))

    const speakerNodes = speakers.map(
      function (speaker) {
        return <SpeakerRow
        key={speaker.name}
        speaker={speaker}
        maxFloorTime={mostFloorTime(speakers)}
        />
      }
    )

    return (
      <div>

      <div className='floorSpeaker'>
      <h2>{hasFloor(speakers).name}</h2>
      <h4>has the floor</h4>
      </div>

      <table className='stack'>
      <thead>
      <tr>
      <th>Name</th>
      <th>Speaking Time</th>
      </tr>
      </thead>
      <tbody>
      {speakerNodes}
      </tbody>
      </table>

      </div>
    )
  }
})

// attach
ReactDOM.render(
  <App speakers={speakers} />,
  document.getElementById('container')
)
