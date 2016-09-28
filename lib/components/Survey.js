import React from 'react'
import { map, propOr } from 'ramda'

const valueMap = {
  'true': true,
  'false': false,
  'Unset': null
}

module.exports = React.createClass({
  render: function () {
    const { surveyFields, survey, setSurveyField } = this.props

    const surveyCheckboxes = map(
      (surveyField) => (
        <div key={surveyField.name}>
          <label>
            <select
              value={propOr(null, surveyField.name, survey)}
              onChange={(event) => setSurveyField(surveyField.name, valueMap[event.target.value])}
            >
              <option value={null}>Unset</option>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
            &nbsp; {surveyField.description}
          </label>
        </div>
      )
    )(surveyFields)

    return (
      <div className='survey'>
        <form>
        {surveyCheckboxes}
        </form>
      </div>
    )
  }
})
