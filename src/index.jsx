require('./index.html');
require('_styles/common.scss');
require('_assets/favicon.ico');
require('_assets/favicon-hires.png');
require('./data/data-bestiary.json');
require('./data/data-classes.json');
require('./data/data-spellbook.json');

import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import App from 'App';

import fetchData from '_utils/fetchData';
import reducers from '_utils/reducers';

const devCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = devCreateStore(
  combineReducers({
    main: reducers,
    routing: routerReducer
  })
);

const history = syncHistoryWithStore(useRouterHistory(createHashHistory)({ queryKey: false }), store);
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='*' component={App}/>
    </Router>
  </Provider>
), document.getElementById('app'));

fetchData(data => {
  store.dispatch({
    type: 'INIT',
    data
  });
});
