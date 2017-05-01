import R        from 'ramda'
import React    from 'react'
import { Link } from 'react-router-dom'
import Divider  from 'material-ui/Divider'
import Avatar   from 'material-ui/Avatar'

import ChatBox        from './shared-components/message/chat-box.js'
import AvatarPopover  from './shared-components/avatar/avatar-popover.js'
import { mapIndexed } from '../lib/helpers.js'

const COLUMNS = 3

const _getFeatureImage = id => R.compose(
  R.path(['path']),
  R.find(R.propEq('id', id))
)

const _renderProduct = startChattingFn => product => (
  <div
    key={product.id}
    className='col-12 col-md-4 mt-4'
  >
    <div className='hoverable'>
      <Link to={`/product/details/${product.id}`}>
        <div 
          style={{
            background: `url(${_getFeatureImage(product.feature_image_id)(
              product.images)}) no-repeat center center`,
            backgroundSize: 'cover',
            height: '200px'
          }}
        />
        <div className='text-center mt-3'>
          <div className='p-3'>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
          </div>
        </div>
      </Link>
      <Divider />
      <div className='container'>
        <div className='row align-items-center justify-content-between p-2'>
          <p>${product.price}</p>
          <AvatarPopover
            user={product.user} 
            startChatting={startChattingFn}
          />
        </div>
      </div>
    </div>
  </div>
)


const _renderProductGroup = startChattingFn => (list, index) => (
  <div key={index} className="row">
    {R.map(_renderProduct(startChattingFn))(list)}
  </div>
)


class ProductList extends React.Component {
  constructor() {
    super()
    this.state = {
      open_chat: false,
      target_user: {}
    }
  }


  closeChatBox = () => {
    this.setState({open_chat: false})
  }


  startChatting = target_user => this.setState({
    open_chat: true,
    target_user
  })


  render() {
    const product_group = R.splitEvery(COLUMNS)(this.props.products)

    return (
      <div>
        {
          // render a list of products
          mapIndexed( _renderProductGroup(this.startChatting) )(product_group)
        }    
        {
          // render a chatbox on top of the whole containers lay,
          // not just the component itself
          this.state.open_chat ? 
            <ChatBox 
              onClickClose={this.closeChatBox} 
              to_chat_room={true}
              target_user={this.state.target_user}
            /> 
          : null
        }
      </div>
    )
  }
}


export default ProductList
