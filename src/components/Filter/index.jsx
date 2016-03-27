import styles from './styles.scss';

import { connect } from 'react-redux';

function Filter ({ value, list, allSuffix, onValueChange }) {
  return (
    <div styleName='root'>
      <div styleName='select-wrapper'>
        <select styleName='select' onChange={onValueChange}>
          {list.map((item, i) => {
            return <option key={item} value={i}>{item}</option>;
          })}
        </select>
        <div styleName='select-cover'>
          <div>{value === 0 ? `All ${allSuffix}` : list[value]}</div>
          <div>▾</div>
        </div>
      </div>
    </div>
  );
}

Filter.propTypes = {
  value: React.PropTypes.number,
  list: React.PropTypes.array,
  allSuffix: React.PropTypes.string,
  onValueChange: React.PropTypes.func
};

function mapStateToProps (state) {
  return {
    value: state.app.filterValue
  };
}

function mapDispatchToProps (dispatch) {
  return {
    onValueChange: e => dispatch({ type: 'FILTER', value: Number(e.target.value) })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCSS(Filter, styles));
