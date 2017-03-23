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
if (process.env.NODE_ENV !== 'production') {
  // composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
}

const store = createStore(
  Reducers,
  composeEnhancers(applyMiddleware(Thunk))
)

// TODO: There should be a way to apply Pormise to the middleware to create
// a initial state
getCurrentUser()
  .then( User => {
    const store = createStore(
      Reducers,
      { User: R.when(R.isNil, R.always({}))(User) },
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

