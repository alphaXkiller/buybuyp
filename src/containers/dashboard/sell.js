import R                    from 'ramda'
import React, { Component } from 'react'
import { connect }          from 'react-redux'
import RaisedButton         from 'material-ui/RaisedButton'
import FlatButton           from 'material-ui/FlatButton'
import { Stepper }          from 'material-ui/Stepper'

import StepInfo 
from '../../components/shared-components/stepper/info.js'

import StepUploadImage 
from '../../components/shared-components/stepper/upload-image.js'

import StepSearchLocation 
from '../../components/shared-components/stepper/search-place.js'

import { Product } from '../../actions/index.js'
import { 
  notEmpty,
  notNil, 
  nilOrEmpty, 
  notNilOrEmpty
} from '../../lib/helpers.js'

import './sell.scss'

class Sell extends Component {
  state = {
    completed: false,
    step_index: 0,
    images: [],
    locations: [],
    timeout: null,
    location_service: new google.maps.places.AutocompleteService(),
    form_value: {},
    loading: false
  }


  constructor() {
    super()
    this.handleNext       = this.handleNext.bind(this)
    this.handlePrev       = this.handlePrev.bind(this)
    this.onInputLocation  = this.onInputLocation.bind(this)
    this.onSubmitStepOne  = this.onSubmitStepOne.bind(this)
    this.onSubmitStepTwo  = this.onSubmitStepTwo.bind(this)
    this.addImages        = this.addImages.bind(this)
    this.deleteImage      = this.deleteImage.bind(this)
    this.onUpdateLocation = this.onUpdateLocation.bind(this)
    this.submit           = this.submit.bind(this)
    this.renderStepAction = this.renderStepAction.bind(this)
  }


  componentDidUpdate(prev_props, prev_state) {
    if (notNilOrEmpty(this.props.posted_product))
      this.props.history.push(
        `/dashboard/product/${this.props.posted_product.id}`
      )      
  }


  onInputLocation(e) {
    R.when(notNil, clearTimeout)(this.state.timeout)
    const input = e.target.value

    if (nilOrEmpty(input)) return

    this.setState({
      timeout: setTimeout( () => {
        this.state.location_service.getPlacePredictions({
          input: input
        }, (locations, status) => this.setState({
          locations: R.pluck('description')(locations)}))
      }, 800 )
    })
  }

  
  onUpdateLocation(address) {
    this.setState({
      form_value: R.merge(this.state.form_value, {address})
    })
  }


  onSubmitStepOne(e) {
    e.preventDefault()
    const nodes = R.filter(
      R.compose(
        notEmpty,
        R.path(['name'])
      )
    )(document.querySelectorAll('#step_info input, textarea'))
    let form_error = null
    let form_value = {}

    R.forEach(R.ifElse(
      R.pathEq(['value'], ''),
      ({name}) => {
        form_error = R.merge(form_error, {[name]: 'This filed is required'}) 
      },
      ({name, value}) => {
        form_value = R.merge(form_value, {[name]: value})
      }
    ))(nodes)

    this.setState({form_error, form_value}, () =>
      R.when(R.isNil, () => this.handleNext())(this.state.form_error)
    )
  }


  onSubmitStepTwo(e) {
    e.preventDefault()

    if (R.isEmpty(this.state.images)) {
      const form_error = { upload_image: 'Image is required' }
      this.setState({form_error})
    } else {
      this.handleNext()
    }
  }


  submit(e) {
    e.preventDefault()

    if (R.isEmpty(e.target.address.value)) {
      const form_error = { address: 'This filed is required' }
      this.setState({form_error})
    } else {
      const form_error = null
      const loading = true

      let image_files = R.reduce(
        (data, file) => {
          data.append('image', file)
          return data
        }
      )(new FormData())(this.state.images)

      this.setState({form_error, loading}, () => {
        this.props.postProduct({
          form_value: this.state.form_value, image_files
        })
      })
    }
  }

  handleNext() {
    const { step_index } = this.state

    this.setState({
      completed: step_index >= 2,
      step_index: step_index + 1
    })
  }


  handlePrev() {
    const { step_index } = this.state
    this.setState({
      completed: step_index >= 2,
      step_index: step_index - 1
    })
  }


  addImages(e) {
    const input_files = R.values(document.getElementById('upload-image').files)
    const images = R.concat(this.state.images)(input_files)
    const form_error = null

    this.setState({images, form_error})
  }


  deleteImage = image => e => {
    const images = R.reject(R.equals(image))(this.state.images)
    this.setState({images})
  }

  renderStepAction() {
    const { step_index, completed } = this.state

    return (
      <div className='step-action'>
        {
          step_index > 0 ?
            <FlatButton 
              label='Prev'
              onTouchTap={ this.handlePrev }
            />
            : null
        }
        <RaisedButton
          label={ step_index === 2 ? 'Done' : 'Next' }
          type='submit'
        />
      </div>
    )
  }


  render() {
    return (
      <div>
        <Stepper activeStep={this.state.step_index} orientation='vertical'>
          {
            StepInfo({
              submit: this.onSubmitStepOne,
              form_value: this.state.form_value,
              form_error: this.state.form_error,
              renderStep: this.renderStepAction
            })
          }
          {
            StepUploadImage({
              submit: this.onSubmitStepTwo,
              addImages: this.addImages,
              deleteImage: this.deleteImage,
              images: this.state.images,
              renderStep: this.renderStepAction,
              error_msg: R.path(['state', 'form_error', 'upload_image'])(this)
            })
          }
          {
            StepSearchLocation({
              submit: this.submit,
              onUpdateLocation: this.onUpdateLocation,
              list: this.state.locations,
              onKeyUp: this.onInputLocation,
              renderStep: this.renderStepAction,
              error_msg: R.path(['state', 'form_error', 'address'])(this)
            })
          }
        </Stepper>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  posted_product: state.Product.posted
})

const mapDispatchToProps = dispatch => ({
  postProduct: ({image_files, form_value}) =>
    dispatch(Product.postProduct({image_files, form_value}))
})


export default connect(mapStateToProps, mapDispatchToProps)(Sell)
