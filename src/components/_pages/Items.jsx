import { connect } from 'react-redux';
import { getGroupedListDataForCategory } from '_utils/common';

import Message from 'Message';
import Search from 'Search';
import Filter from 'Filter';
import ItemsList from '_lists/ItemsList';

function Items ({ options, filteredGroupedList, isEmpty, ...rest }) {
  return (
    <div>
      <Search/>
      <Filter options={options} allSuffix='items'/>
      <ItemsList filteredGroupedList={filteredGroupedList} {...rest}/>
      {isEmpty ?
        <Message type='NOT_FOUND'/> : null}
    </div>
  );
}

function mapStateToProps (state) {
  return getGroupedListDataForCategory('ITEMS', 'byType', state.data, state.searchValue, state.filterValue);
}

export default connect(
  mapStateToProps
)(Items);
