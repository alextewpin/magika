import styles from './styles.scss';

import { connect } from 'react-redux';
import { filterList } from '_utils/common';

import List from 'List';

function GroupedList ({ groupedList, dictionary, searchValue, filterValue, makeTitleFromIndex }) {
  return (
    <div>
      {groupedList.map((fullList, i) => {
        const filteredList = filterList(fullList, searchValue);
        return (
          <List
            key={i}
            isHidden={!(filteredList.length > 0)}
            title={makeTitleFromIndex(i)}
            filteredList={filteredList}
            fullList={fullList}
            dictionary={dictionary}/>
        );
      })}
    </div>
  );
}

function mapStateToProps (state) {
  return {
    searchValue: state.app.searchValue,
    filterValue: state.app.filterValue
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(GroupedList, styles));
