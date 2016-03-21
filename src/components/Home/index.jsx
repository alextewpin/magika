import styles from './styles.scss';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Search from 'Search';
import List from 'List';

function filterList (list, searchValue) {
  return list.filter(item => {
    return item.toLowerCase().indexOf(searchValue.toLowerCase().replace(/\s/g, '_').replace(/\//g, '_')) !== -1;
  });
}

function Home ({ spellbook, bestiary, classes, searchValue }) {
  const menu = (
    <div>
      <Link to='/spellbook'>Spellbook</Link>
      <Link to='/bestiary'>Bestiary</Link>
      <Link to='/classes'>Classes</Link>
    </div>
  );
  const notFound = <div>Not Found</div>;
  function isNotFound () {
    return spellbook.list.length === 0 && bestiary.list.length === 0 && spellbook.list.length === 0;
  }
  function getContent () {
    if (false && searchValue === '') {
      return menu;
    } else {
      if (isNotFound()) {
        return (
          <div>
            {notFound}
            {menu}
          </div>
        );
      } else {
        return (
          <div>
            <List {...spellbook} title={'Spellbook'} link={'/spellbook'} maxLength={5}/>
            <List {...bestiary} title={'Bestiary'} link={'/bestiary'} maxLength={5}/>
            <List {...classes} title={'Classes'} link={'/classes'} maxLength={5}/>
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
  return {
    spellbook: {
      list: filterList(data.SPELLS, searchValue),
      dictionary: data.SPELLS_BY_KEY
    },
    bestiary: {
      list: filterList(data.MONSTERS, searchValue),
      dictionary: data.MONSTERS_BY_KEY
    },
    classes: {
      list: filterList(data.CLASSES, searchValue),
      dictionary: data.CLASSES_BY_KEY
    },
    searchValue
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(Home, styles));
