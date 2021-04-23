import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { setAuthorizationToken } from '../utils/setAuthorizationToken';
import * as user from './user/reducers';
import * as common from './common/reducers';
import * as commerce from './commerce/reducers';

const rootReducer = combineReducers({
  ...user,
  ...common,
  ...commerce
});

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(setAuthorizationToken, thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
)