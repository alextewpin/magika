import styles from './styles.scss';

import { connect } from 'react-redux';

import Nav from 'Nav';
import Line from 'Line';

function App ({ isLoading = true, children }) {
  return (
    <div>
      <Nav/>
      <div>
        {isLoading ?
          <Line value='Fetching...' type='text'/> : children}
      </div>
    </div>
  );
}

App.propTypes = {
  isLoading: React.PropTypes.bool,
  children: React.PropTypes.node
};

function mapStateToProps (state) {
  return {
    isLoading: state.isLoading
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(App, styles));
