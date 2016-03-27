import styles from './styles.scss';

import { connect } from 'react-redux';

import Line from 'Line';

function List ({
    title,
    link,
    filteredList,
    fullList,
    dictionary,
    category,
    maxLength = 0,
    showAll = false,
    isHidden = false,
    onShowAll,
    key
  }) {
  if (!fullList && filteredList.length === 0) {
    return null;
  }
  function getShowMore () {
    if (maxLength !== 0 && filteredList.length > maxLength && !showAll) {
      const _onShowAll = () => onShowAll(category);
      return <Line value={`Show ${filteredList.length - maxLength} more`} style='show-all' onClick={_onShowAll}/>;
    }
    return null;
  }
  function getList () {
    if (fullList) {
      return (
        fullList.map(item => {
          return <Line key={item} value={dictionary[item].name} isHidden={filteredList.indexOf(item) === -1}/>;
        })
      );
    } else {
      return (
        filteredList.map((item, i) => {
          if (showAll || (maxLength !== 0 && i + 1 <= maxLength)) {
            return <Line key={item} value={dictionary[item].name}/>;
          }
          return null;
        })
      );
    }
  }
  return (
    <div key={key} styleName={`root_is-hidden_${isHidden}`}>
      <Line value={title} link={link} style='h2'/>
      {getList()}
      {getShowMore()}
    </div>
  );
}

function mapDispatchToProps (dispatch) {
  return {
    onShowAll: category => dispatch({ type: 'SHOW_ALL', category })
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ReactCSS(List, styles));
