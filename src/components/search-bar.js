import R            from 'ramda'
import Qs           from 'qs'
import React        from 'react'
import AutoComplete from 'material-ui/Autocomplete'
import MoreIcon     from 'material-ui/svg-icons/navigation/expand-less'
import SelectField  from 'material-ui/SelectField'
import MenuItem     from 'material-ui/MenuItem'

import Debounce    from 'lodash/debounce'
import { notNilOrEmpty } from '../lib/helpers.js'


const _renderOptionBtn = ({toggleOptions, expand_options}) => (
  <button 
   type='button'
    onTouchTap={toggleOptions}
    style={{paddingTop: '37px'}}
    className='buybuy-btn'
  >
    {
      expand_options ?
        <i className="fa fa-angle-double-up fa-lg"/>
      : <i className="fa fa-angle-double-down fa-lg"/>
    }
  </button>

)
 

const _renderCategory = category => (
  <MenuItem key={category.id} value={category.id} primaryText={category.name} />
)

class SearchBar extends React.Component {
  constructor() {
    super()
    this.state = {
      expand_options : false,
      cid: null
    } 
  }


  // For autocomplete to hit the api later on.
  // Debounce api hit for every keystroke
  // onUpdateInput = Debounce( (text, list, params) => {
  //   this.setState({keyword: text})
  // }, 500 )


  submit = e => {
    e.preventDefault()

    const query = {
      keyword: e.target.keyword.value,
      cid: this.state.cid
    }


    if (query.keyword !== '') {
      let path = R.compose(
        R.concat('/product/search?'),
        Qs.stringify,
        R.filter(notNilOrEmpty)
      )(query)

      this.props.history.push(path)
    }
  }


  toggleOptions = e => {
    this.setState({expand_options: !this.state.expand_options})
  }


  onSelectCategory = (e, index, value) => this.setState({cid: value})


  render() {
    return (
      <form onSubmit={this.submit}>
        <div className='d-flex align-items-start'>
          {
            this.props.show_options ? 
              _renderOptionBtn({
                toggleOptions  : this.toggleOptions,
                expand_options : this.state.expand_options
              })
            : null
          }
          <div className='d-flex flex-column w-100'>
            <AutoComplete
              name='keyword'
              fullWidth
              floatingLabelText='Search'
              dataSource={[]}
              autoComplete='off'
            />
            {
              this.state.expand_options ?
                <SelectField
                  name='category'
                  floatingLabelText='Category'
                  value={this.state.cid}
                  onChange={this.onSelectCategory}
                >
                  <MenuItem value={null} primaryText='' />
                  {
                    this.props.category ?
                      R.map(_renderCategory)(this.props.category)
                    : null
                  }
                </SelectField>
              : null
            }
          </div>
        </div>
      </form>
    )
  }
}

export default SearchBar
