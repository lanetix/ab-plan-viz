var R = require("ramda")
var moment = require("moment")

var speakers = [{
  name: "Bjorn",
  speeches: [{
    "start": "2016-01-15T19:15:33-05:00",
    "end": "2016-01-15T19:35:44-05:00"
  }, {
    "start": "2016-01-12T19:15:33-05:00",
    "end": "2016-01-12T19:35:44-05:00"
  }],
  onStack: false,
  approved: true
}, {
  name: "Sven",
  speeches: [{
    "start": "2016-01-15T19:15:13-05:00",
    "end": "2016-01-15T19:35:54-05:00"
  }, {
    "start": "2016-01-17T19:15:13-05:00",
    "end": "2016-01-17T19:35:14-05:00"
  }],
  onStack: false,
  approved: false
}]

var duration = function (speech) {
    return moment(speech.end).diff(moment(speech.start), 'seconds')
}

var speechesTotalDuration = R.pipe(
    R.map(duration),
    R.sum
)

R.map(
    (speaker) => R.assoc('total', speechesTotalDuration(speaker.speeches), speaker)
)(speakers)
