import styles from './styles.scss';

import { connect } from 'react-redux';

import { Line, SpellLine } from 'Line';

function List ({
    title,
    link,
    filteredList,
    dictionary,
    bookmarks,
    expanded,
    itemCategory,
    isHidden = false,
    extras = null,
    key,
    onToggleBookmark,
    onExpandLine
  }) {
  return (
    <div key={key} styleName={`root_is-hidden_${isHidden}`}>
      <Line value={title} link={link} style='h2'/>
      {filteredList.map(item => {
        const _onToggleBookmark = onToggleBookmark.bind(null, itemCategory, item);
        const _onExpandLine = onExpandLine.bind(null, itemCategory, item);
        switch (itemCategory) {
          case 'SPELLBOOK':
            return (
              <SpellLine
                key={item}
                spell={dictionary[item]}
                isBookmarked={bookmarks[itemCategory].indexOf(item) !== -1}
                isExpanded={expanded[itemCategory].indexOf(item) !== -1}
                onToggleBookmark={_onToggleBookmark}
                onExpandLine={_onExpandLine}/>
            );
          default:
            return <Line key={item} value={dictionary[item].name}/>;
        }
      })}
      {extras}
    </div>
  );
}

function mapDispatchToProps (dispatch) {
  return {
    onToggleBookmark: (category, value, e) => {
      e.stopPropagation();
      return dispatch({ type: 'TOGGLE_BOOKMARK', category, value });
    },
    onExpandLine: (category, value) => dispatch({ type: 'TOGGLE_EXPAND', category, value })
  };
}

function mapStateToProps (state) {
  return {
    bookmarks: state.bookmarks,
    expanded: state.expanded
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactCSS(List, styles));
