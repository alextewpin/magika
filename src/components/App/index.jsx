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
        <div>
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  isLoading: React.PropTypes.bool,
  children: React.PropTypes.node
};

function mapStateToProps (state) {
  return {
    isLoading: state.app.isLoading
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(App, styles));
