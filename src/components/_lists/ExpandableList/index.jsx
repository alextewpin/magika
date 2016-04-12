import { connect } from 'react-redux';

import Line from 'Line';
import List from '_lists/List';

function ExpandableList ({ filteredList, category, maxLength = 0, showAll = false, onShowAll, ...rest }) {
  if (filteredList.length === 0) {
    return <span/>;
  }
  function getShowMore () {
    if (filteredList.length > maxLength && !showAll) {
      const _onShowAll = onShowAll.bind(null, category);
      return <Line value={`Show ${filteredList.length - maxLength} more`} style='show-all' onClick={_onShowAll}/>;
    }
    return null;
  }
  const collapsedList = showAll ? filteredList : filteredList.slice(0, maxLength);
  return <List filteredList={collapsedList} extras={getShowMore()} category={category} {...rest}/>;
}

function mapDispatchToProps (dispatch) {
  return {
    onShowAll: category => dispatch({ type: 'SHOW_ALL', category })
  };
}

export default connect(
  null,
  mapDispatchToProps
)(ExpandableList);
