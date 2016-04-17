import { connect } from 'react-redux';
import { getGroupedListDataForCategory } from '_utils/common';

import Message from 'Message';
import Search from 'Search';
import Filter from 'Filter';
import BestiaryList from '_lists/BestiaryList';

function Bestiary ({ options, filteredGroupedList, isEmpty, ...rest }) {
  return (
    <div>
      <Search/>
      <Filter options={options} allSuffix='monsters'/>
      <BestiaryList filteredGroupedList={filteredGroupedList} {...rest}/>
      {isEmpty ?
        <Message type='NOT_FOUND'/> : null}
    </div>
  );
}

function mapStateToProps (state) {
  return getGroupedListDataForCategory('BESTIARY', 'byType', state.data, state.searchValue, state.filterValue);
}

export default connect(
  mapStateToProps
)(Bestiary);
