import styles from './styles.scss';

import Nav from 'Nav';

function App ({ children }) {
  return (
    <div>
      <Nav/>
      <div>Search</div>
      <div>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.any
};

export default ReactCSS(App, styles);
