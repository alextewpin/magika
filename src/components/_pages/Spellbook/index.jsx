import styles from './styles.scss';

import { connect } from 'react-redux';

import Search from 'Search';
import Filter from 'Filter';
import GroupedList from 'GroupedList';

function Spellbook ({ classesList, listData }) {
  function makeTitleFromIndex (index) {
    if (index === 0) {
      return 'Cantrips';
    } else {
      return `Level ${index}`;
    }
  }
  return (
    <div>
      <Search/>
      <Filter list={classesList} allSuffix='spells'/>
      <GroupedList {...listData} makeTitleFromIndex={makeTitleFromIndex}/>
    </div>
  );
}

function mapStateToProps (state) {
  const { data, filterValue } = state.app;
  return {
    classesList: data.SPELLS_CHAR_FILTERS,
    listData: {
      fullList: data.SPELLS,
      groupedList: data.SPELLS_CHAR_FILTER_LISTS[data.SPELLS_CHAR_FILTERS[filterValue]],
      dictionary: data.SPELLS_BY_KEY
    }
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(Spellbook, styles));
