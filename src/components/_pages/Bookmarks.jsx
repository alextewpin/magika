import { connect } from 'react-redux';
import { getBookmarksListForCategory, getGroupedBookmarksListForCategory } from '_utils/common';

import Message from 'Message';
import List from '_lists/List';
import SpellbookList from '_lists/SpellbookList';
import BestiaryList from '_lists/BestiaryList';
import ItemsList from '_lists/ItemsList';

function Bookmarks ({ spellbook, bestiary, items, classes, bookmarks }) {
  return (
    <div>
      <SpellbookList title='Spellbook' {...spellbook}/>
      <BestiaryList title='Bestiary' {...bestiary}/>
      <ItemsList title='Items' {...items}/>
      <List title='Classes' titleSize='h1' {...classes}/>
      {bookmarks.reduce((sum, cur) => { return sum + cur.length; }, 0) === 0 ?
        <Message type='EMPTY'/> : null}
    </div>
  );
}

function mapStateToProps (state) {
  return {
    spellbook: getGroupedBookmarksListForCategory('SPELLBOOK', 'byClass', state.data, state.bookmarks),
    bestiary: getGroupedBookmarksListForCategory('BESTIARY', 'byType', state.data, state.bookmarks),
    items: getGroupedBookmarksListForCategory('ITEMS', 'byType', state.data, state.bookmarks),
    classes: getBookmarksListForCategory('CLASSES', state.data, state.bookmarks),
    bookmarks: Object.keys(state.bookmarks).map(key => state.bookmarks[key])
  };
}

export default connect(
  mapStateToProps
)(Bookmarks);
