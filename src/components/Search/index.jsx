import styles from './styles.scss';

import { connect } from 'react-redux';

const closeIconPath = 'M8 6.586l-4.95-4.95L1.636 3.05 6.586 8l-4.95 4.95 1.414 1.414L8 9.414l4.95 4.95 1.414-1.414L9.414 8l4.95-4.95-1.414-1.414L8 6.586z'; //eslint-disable-line max-len

function Search ({ value, onValueChange, onClear }) {
  function getClearIcon () {
    return value === '' ? null : (
      <svg styleName='icon' onClick={onClear}>
        <path d={closeIconPath} fill-rule='evenodd'/>
      </svg>
    );
  }
  return (
    <div styleName='root'>
      <input
        styleName='input'
        placeholder='Search'
        value={value}
        onChange={onValueChange}/>
      {getClearIcon()}
    </div>
  );
}

Search.propTypes = {
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
  onClear: React.PropTypes.func
};

function mapStateToProps (state) {
  return {
    value: state.app.searchValue
  };
}

function mapDispatchToProps (dispatch) {
  return {
    onValueChange: e => dispatch({ type: 'SEARCH', value: e.target.value }),
    onClear: () => dispatch({ type: 'CLEAR_SEARCH' })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCSS(Search, styles));
