import R                   from 'ramda'
import React               from 'react'
import Qs                  from 'qs'
import { Route, Redirect } from 'react-router-dom'

import Home            from './containers/public/home.js'
import ProductSearch   from './containers/public/product-search.js'
import ProductDetails  from './containers/public/product-details.js'
import Login           from './containers/public/login.js'
import DMain           from './containers/dashboard/main.js'
import DSell           from './containers/dashboard/sell.js'
import DProductDetails from './containers/dashboard/product-details.js'

import { notNil } from './lib/helpers.js'


const FROM_INDEX = 1


const RouteFunctor = [
  { path: '/', component: Home, exact: true },
  { path: '/login', component: Login },
  { path: '/product/search', component: ProductSearch },
  { path: '/product/details/:id', component: ProductDetails },
  { path: '/dashboard', component: DMain, exact: true }, 
  { path: '/dashboard/sell', component: DSell },
  { path: '/dashboard/product/:id', component: DProductDetails }
]


const userNotLogin = R.compose(R.isEmpty, R.prop('user'))


const dashboardPath = R.compose(R.test(/^\/dashboard/), R.prop('path'))


const requiredLogin = R.allPass([userNotLogin, dashboardPath])


const parseSearchQuery = props => R.compose(
  R.when(
    notNil,
    R.compose(
      R.merge(props), 
      R.objOf('query'), 
      Qs.parse, 
      R.slice(FROM_INDEX, Infinity)
    )
  ),
  R.path(['location', 'search'])
)(props)


const RouteActor = route => {
  return (
    <Route 
      path={route.path} 
      exact={route.exact} 
      render={
        props => {
          const _props = parseSearchQuery(props)           

          return (
            requiredLogin(route) ? 
              <Redirect to='/login' />
            : <route.component {..._props} routes={route.sub_routes}/>
          )
        }}
    />
  )
}

export {
  RouteFunctor,
  RouteActor
}
