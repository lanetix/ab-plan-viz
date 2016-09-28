import React from 'react'
import { map } from 'ramda'

module.exports = React.createClass({
  render: function () {
    const { surveyFields, survey, toggleSurveyField } = this.props

    const surveyCheckboxes = map(
      (surveyField) => (
        <div key={surveyField.name}>
          <label>
            <input
              type='checkBox'
              checked={survey[surveyField.name] || false}
              onChange={() => toggleSurveyField(surveyField.name)}
            />
            &nbsp; {surveyField.description}
          </label>
        </div>
      )
    )(surveyFields)

    return (
      <div class='survey'>        
        <form>
        {surveyCheckboxes}
        </form>
        <pre>{JSON.stringify(survey)}</pre>
      </div>
    )
  }
})
