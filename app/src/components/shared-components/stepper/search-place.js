import R from 'ramda'
import React from 'react'
import TextField from 'material-ui/TextField'
import {
  Step,
  StepLabel,
  StepContent
} from 'material-ui/Stepper'
import AutoComplete from 'material-ui/Autocomplete'


const searchLocation = props => {
  return (
    <Step>
      <StepLabel>Location</StepLabel>
      <StepContent>
        <form onSubmit={props.submit}>
          <AutoComplete
            floatingLabelText='Address'
            onUpdateInput={props.onUpdateLocation}
            autoComplete='off'
            searchText={props.input_value}
            dataSource={props.list}
            errorText={props.error_msg}
            fullWidth
            hintText='4505 S Maryland Pkwy, Las Vegas'
            onKeyUp={props.onKeyUp}
            filter={R.always(true)}
            name='address'
            id='address-autocomplete'
          />
          {props.renderStep()}
        </form>
      </StepContent>
    </Step>
  )
}


export default searchLocation
