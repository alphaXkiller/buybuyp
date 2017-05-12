import R                                         from 'ramda'
import React                                     from 'react'
import ReactDom                                  from 'react-dom'
import { Provider }                              from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import Thunk                                     from 'redux-thunk'
import ReactTapEventPlugin                       from 'react-tap-event-plugin'
import MuiThemeProvider                          from 'material-ui/styles/MuiThemeProvider'

import App   from './app.js'
import Reducers from './reducers/index.js'
import { getCurrentUser } from './lib/auth.js'


// onTouchTap
ReactTapEventPlugin()

let composeEnhancers = compose
// if (process.env.NODE_ENV !== 'production') {
//   composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
// }

getCurrentUser()
  .then( user => {
    const User = R.defaultTo({}, user)
    let store = createStore(
      Reducers,
      {User},
      composeEnhancers(applyMiddleware(Thunk))
    )

    ReactDom.render(
      <Provider store={store}>
        <MuiThemeProvider>
          <App />
        </MuiThemeProvider>
      </Provider>,
      document.getElementById('buybuy')
    )
  })


