import React     from 'react'
import { Route } from 'react-router-dom'

import Home from './containers/home.js'
import DSell from './containers/dashboard/sell.js'
import DProductDetails from './containers/dashboard/product-details.js'

const Routes = () => (
  <main>
    <Route exact path='/' component={Home} />
    <Route path='/dashboard/sell' component={DSell} />
    <Route path='/dashboard/product/:id' component={DProductDetails} />
  </main>
)

export default Routes
