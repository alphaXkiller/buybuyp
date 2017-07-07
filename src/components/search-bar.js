import R            from 'ramda'
import Qs           from 'qs'
import React        from 'react'
import { connect }  from 'react-redux'
import AutoComplete from 'material-ui/Autocomplete'
import MoreIcon     from 'material-ui/svg-icons/navigation/expand-less'
import SelectField  from 'material-ui/SelectField'
import MenuItem     from 'material-ui/MenuItem'
import TextField    from 'material-ui/TextField'
import Debounce     from 'lodash/debounce'

import { notNilOrEmpty } from '../lib/helpers.js'
import { OptionSortBy }  from '../constant/search-bar-option.js'
import { stringifyUrl }  from '../lib/router-util.js'

const ALL_CAT = '0'

const _renderOptionBtn = ({toggleOptions, expand_options}) => (
  <button 
   type='button'
    onTouchTap={toggleOptions}
    style={{paddingTop: '37px'}}
    className='btn frameless'
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


const _renderSortBy = key => (
  <MenuItem key={key} value={OptionSortBy[key]} primaryText={key} />
)

class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expand_options : false,
      cid            : parseInt(props.query.cid) || ALL_CAT,
      price_min      : props.query.price_min, 
      price_max      : props.query.price_max,
      sort_by        : props.query.sort_by || 'posted'
    } 
  }


  // For autocomplete to hit the api later on.
  // Debounce api hit for every keystroke
  // onUpdateInput = Debounce( (text, list, params) => {
  //   this.setState({keyword: text})
  // }, 500 )

  submit = e => {
    e.preventDefault()

    const _pre_query = {
      keyword   : e.target.keyword.value,
      cid       : this.state.cid ? this.state.cid : ALL_CAT,
      price_min : this.state.price_min,
      price_max : this.state.price_max,
      sort_by   : this.state.sort_by
    }

    const query = R.compose(
      R.filter(notNilOrEmpty),
      R.when(R.propEq('cid', ALL_CAT), R.dissoc('cid'))
    )(_pre_query)

    const path = R.compose(
      R.concat('/?'),
      Qs.stringify
    )(query)

    this.props.history.push(path)
    this.props.search(query)
  }


  toggleOptions = e => {
    this.setState({expand_options: !this.state.expand_options})
  }


  onSelectCategory = (e, index, value) => this.props.history.push(
    stringifyUrl('/', R.merge(this.props.query, { cid: value }))
  )


  onChangePrice = name => (e, text) => this.setState({[name]: text})


  onSelectSortOption = (e, key, value) => this.setState({sort_by: value}) 


  _renderOptions = () => (
    <div className='row'>
      <div className='col-md-3'>
        <SelectField
          fullWidth={true}
          name='category'
          floatingLabelText='Category'
          value={this.state.cid}
          onChange={this.onSelectCategory}
        >
          <MenuItem value={ALL_CAT} primaryText='all' />
          {
            this.props.category ?
              R.map(_renderCategory)(this.props.category)
            : null
          }
        </SelectField>
      </div>
      <div className='col-md-3'>
        <SelectField
          fullWidth={true}
          name='sort_by'
          floatingLabelText='sort_by'
          value={this.state.sort_by}
          onChange={this.onSelectSortOption}
        >
          { R.map(_renderSortBy)(R.keys(OptionSortBy)) }
        </SelectField>
      </div>
      <div className='col-md-3'>
        <TextField 
          value={this.state.price_min}
          fullWidth={true}
          floatingLabelText='Min Price' 
          onChange={this.onChangePrice('price_min')}
        />
      </div>
      <div className='col-md-3'>
        <TextField 
          value={this.state.price_max}
          fullWidth={true}
          floatingLabelText='Max Price' 
          onChange={this.onChangePrice('price_max')}
        />
      </div>
    </div>
  )


  render() {
    return (
      <form className='row' onSubmit={this.submit}>
        <div className='d-flex align-items-start w-100'>
          {
            _renderOptionBtn({
              toggleOptions  : this.toggleOptions,
              expand_options : this.state.expand_options
            })
          }
          <div className='w-100' style={{paddingRight: '16px'}}>
            <AutoComplete
              name='keyword'
              fullWidth
              floatingLabelText='Search'
              dataSource={[]}
              autoComplete='off'
            />
            { this.state.expand_options ? this._renderOptions() : null }
          </div>
        </div>
      </form>
    )
  }
}

          // <button 
          //   style={{paddingTop: '25px'}}
          //   className='btn frameless'
          // >
          //   <i className='fa fa-search fa-2x' />
          // </button>

const mapStateToProps = (state, props) => ({
  category: state.ProductCategory
})


export default connect(mapStateToProps)(SearchBar)
