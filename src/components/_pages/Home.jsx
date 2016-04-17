import { connect } from 'react-redux';
import { getListDataForCategory } from '_utils/common';

import Search from 'Search';
import ExpandableList from '_lists/ExpandableList';
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
  const { data, searchValue, showAll } = state;
  const common = [data, searchValue, showAll];
  return {
    spellbook: getListDataForCategory('SPELLBOOK', ...common),
    bestiary: getListDataForCategory('BESTIARY', ...common),
    classes: getListDataForCategory('CLASSES', ...common),
    searchValue
  };
}

export default connect(
  mapStateToProps
)(Home);
