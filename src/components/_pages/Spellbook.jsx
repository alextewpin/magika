import { connect } from 'react-redux';
import { getGroupedListDataForCategory, isGroupedListNotEmpty } from '_utils/common';

import Message from 'Message';
import Search from 'Search';
import Filter from 'Filter';
import SpellbookList from '_lists/SpellbookList';

function Spellbook ({ options, filteredGroupedList, isEmpty, ...rest }) {
  return (
    <div>
      <Search/>
      <Filter options={options} allSuffix='spells'/>
      <SpellbookList filteredGroupedList={filteredGroupedList} {...rest}/>
      {isEmpty ?
        <Message type='NOT_FOUND'/> : null}
    </div>
  );
}

function mapStateToProps (state) {
  return getGroupedListDataForCategory('SPELLBOOK', 'byClass', state.data, state.searchValue, state.filterValue);
}

export default connect(
  mapStateToProps
)(Spellbook);
