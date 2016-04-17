import { connect } from 'react-redux';
import { getListDataForCategory } from '_utils/common';

import List from '_lists/List';

function Classes (props) {
  return <List {...props}/>;
}

function mapStateToProps (state) {
  return getListDataForCategory('CLASSES', state.data);
}

export default connect(
  mapStateToProps
)(Classes);
