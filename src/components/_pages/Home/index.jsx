import styles from './styles.scss';

import { connect } from 'react-redux';
import { filterList } from '_utils/common';

import Search from 'Search';
import ExpandableList from 'ExpandableList';
import Line from 'Line';
import Message from 'Message';

function Home ({ spellbook, bestiary, classes, searchValue }) {
  const menu = (
    <div>
      <Line link='/spellbook' value='Spellbook'/>
      <Line link='/bestiary' value='Bestiary'/>
      <Line link='/classes' value='Classes'/>
    </div>
  );
  function isNotFound () {
    return (
      spellbook.filteredList.length === 0 &&
      bestiary.filteredList.length === 0 &&
      spellbook.filteredList.length === 0
    );
  }
  function getListProps (title) {
    return {
      title,
      category: title.toLowerCase(),
      link: {
        pathname: `/${title.toLowerCase()}`,
        query: {
          searchValue
        }
      },
      maxLength: 5
    };
  }
  function getContent () {
    if (searchValue === '') {
      return menu;
    } else {
      if (isNotFound()) {
        return (
          <div>
            <Message type='NOT_FOUND'/>
            <Line style='text'/>
            {menu}
          </div>
        );
      } else {
        return (
          <div>
            <ExpandableList {...spellbook} {...getListProps('Spellbook')}/>
            <ExpandableList {...bestiary} {...getListProps('Bestiary')}/>
            <ExpandableList {...classes} {...getListProps('Classes')}/>
          </div>
        );
      }
    }
  }
  return (
    <div>
      <Search/>
      {getContent()}
    </div>
  );
}

Home.propTypes = {
  spellbook: React.PropTypes.object.isRequired,
  bestiary: React.PropTypes.object.isRequired,
  classes: React.PropTypes.object.isRequired,
  searchValue: React.PropTypes.string
};

function mapStateToProps (state) {
  const data = state.app.data;
  const searchValue = state.app.searchValue;
  const showAll = state.app.showAll;
  return {
    spellbook: {
      filteredList: filterList(data.SPELLS, searchValue),
      dictionary: data.SPELLS_BY_KEY,
      showAll: showAll.indexOf('spellbook') !== -1
    },
    bestiary: {
      filteredList: filterList(data.MONSTERS, searchValue),
      dictionary: data.MONSTERS_BY_KEY,
      showAll: showAll.indexOf('bestiary') !== -1
    },
    classes: {
      filteredList: filterList(data.CLASSES, searchValue),
      dictionary: data.CLASSES_BY_KEY,
      showAll: showAll.indexOf('classes') !== -1
    },
    searchValue
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(Home, styles));
