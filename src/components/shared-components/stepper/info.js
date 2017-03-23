import React from 'react'
import TextField from 'material-ui/TextField'
import {
  Step,
  StepLabel,
  StepContent
} from 'material-ui/Stepper'

const info = ({submit, form_value, form_error, renderStep}) => {
  let name_error
  let price_error
  let description_error

  if (form_error) {
    name_error = form_error.name
    price_error = form_error.price
    description_error = form_error.description
  }

  return (
    <Step>
      <StepLabel>Information</StepLabel>
      <StepContent>
        <form id='step_info' onSubmit={submit}>
          <TextField 
            floatingLabelText='Product name'
            autoComplete='off'
            errorText={name_error}
            fullWidth
            hintText='Sony TV 940D' 
            type='text'
            name='name'
            defaultValue={form_value.name}
          />
          <TextField
            floatingLabelText='Price'
            autoComplete='off'
            errorText={price_error}
            fullWidth
            hintText='999.99'
            type='number'
            step='any'
            name='price'
            defaultValue={form_value.price}
          />
          <TextField 
            floatingLabelText='Product Description' 
            autoComplete='off'
            multiLine={true}
            errorText={description_error}
            fullWidth
            hintText='Size: 75; 4 hdmi input sfasdfasdfsfsadfasdf'
            name='description'
            type='text'
            rows={2}
            defaultValue={form_value.description}
          />
          {renderStep()}
        </form>
      </StepContent>
    </Step>
  )
}

export default info
