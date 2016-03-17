import styles from './styles.scss';

import { connect } from 'react-redux';

import Nav from 'Nav';

function App ({ isLoading = true, children }) {
  if (isLoading) {
    return <div>Fetching...</div>;
  } else {
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
}

App.propTypes = {
  isLoading: React.PropTypes.bool,
  children: React.PropTypes.any
};

function mapStateToProps (state) {
  return state.main;
}

export default connect(
  mapStateToProps
)(ReactCSS(App, styles));
