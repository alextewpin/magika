require('babel-polyfill');

require('./index.html');
require('_styles/common.scss');
require('_assets/favicon.ico');
require('_assets/favicon-hires.png');
require('./data/data-bestiary.json');
require('./data/data-classes.json');
require('./data/data-spellbook.json');

import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import App from 'App';
import Home from '_pages/Home';
import Spellbook from '_pages/Spellbook';
import Bestiary from '_pages/Bestiary';
import Classes from '_pages/Classes';
import Bookmarks from '_pages/Bookmarks';

import fetchData from '_utils/fetchData';
import reducers from '_utils/reducers';

import Perf from 'react-addons-perf';
window.perf = Perf;

const devCreateStore = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = devCreateStore(reducers);

const history = syncHistoryWithStore(useRouterHistory(createHashHistory)({ queryKey: false }), store);
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Home}/>
        <Route path='/spellbook' component={Spellbook}/>
        <Route path='/bestiary' component={Bestiary}/>
        <Route path='/classes' component={Classes}/>
        <Route path='/bookmarks' component={Bookmarks}/>
        <Route path='*' component={Home}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'));

fetchData(data => {
  store.dispatch({
    type: 'INIT',
    data
  });
});
