import R from 'ramda'
import React     from 'react'
import TextField from 'material-ui/TextField'
import {
  Step,
  StepLabel,
  StepContent
}                         from 'material-ui/Stepper'
import { List, ListItem } from 'material-ui/List'
import Avatar             from 'material-ui/Avatar'
import RaisedButton       from 'material-ui/RaisedButton'
import Subheader          from 'material-ui/Subheader'


const _renderDeleteBtn = onClickFn => (
  <div onClick={onClickFn}>
    <span>&times;</span>
  </div>
)

const _renderImages = deleteImage => R.map(
  image => {
    const image_src = window.URL.createObjectURL(image) 
    return (
      <ListItem
        key={image_src}
        leftAvatar={<Avatar src={image_src} />}
        primaryText={image.name}
        rightIcon={_renderDeleteBtn(deleteImage(image))}
      />
    )
  }
)


const uploadImage = props => {
  return (
    <Step>
      <StepLabel>Images</StepLabel>
      <StepContent>
        <form 
          encType='multipart/form-data' 
          onSubmit={props.submit}
          className='d-flex flex-column'
        >
          <label htmlFor='upload-image'>
            <i className='fa fa-camera fa-2x' />
          </label>
          <input
            type='file' 
            name='image'
            id='upload-image' 
            accept='image/*' 
            multiple
            style={{display: 'none'}}
            onChange={props.addImages}
          />
          <p>{props.error_msg}</p>
          <List>
            { 
              R.isEmpty(props.images) ? <p>No Images</p> : null }
            {_renderImages(props.deleteImage)(props.images)}
          </List>
          {props.renderStep()}
        </form>
      </StepContent>
    </Step>
  )
}

export default uploadImage
