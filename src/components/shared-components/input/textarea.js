import R        from 'ramda'
import React    from 'react'
import Debounce from 'lodash/debounce'

class Textarea extends React.Component {
  _debounce = Debounce(
    this.props.onChange, 
    R.defaultTo(500, this.props.delay)
  )

  _props = R.omit(['onChange', 'submitFn'], this.props)


  _onChange = e => {
    if (this.props.debounce) {
      e.persist()
      this._debounce(e)
    } else {
      this.props.onChange(e)
    }
  }


  _onKeyUp = e => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.target.value = ''
      this.props.submitFn(e)
    }
  }


  render() {
    return (
      <textarea 
        onChange={this._onChange}
        onKeyUp={this._onKeyUp}
        {...this._props}
      />
    )
  }
}


Textarea.defaultProps = {
  onChange: () => console.warn('Missing onChange props'),
  submitFn: () => {}
}


export default Textarea
