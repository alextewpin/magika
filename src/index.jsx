require('./index.html');
//require('_styles/common.scss');

import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import ReactDOM from 'react-dom';

import App from 'App';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

ReactDOM.render((
  <Router history={appHistory}>
    <Route path='*' component={App}/>
  </Router>
), document.getElementById('app'));
