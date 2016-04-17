import styles from './styles.scss';
import cnTools from '_utils/cnTools';
const cn = cnTools(styles);

import { connect } from 'react-redux';

import Line from 'Line';

function List ({
    title,
    titleSize = 'h2',
    link,
    filteredList,
    dictionary,
    bookmarks,
    expanded,
    category,
    isEmpty = false,
    isHidden = false,
    extras = null,
    key,
    onToggleBookmark,
    onExpandLine
  }) {
  return (
    <div key={key} className={cn('root', { isHidden })}>
      {title && !isEmpty ?
        <Line value={title} link={link} style={titleSize}/> : null}
      {filteredList.map(item => {
        const _onToggleBookmark = onToggleBookmark.bind(null, category, item);
        const _onExpandLine = onExpandLine.bind(null, category, item);
        return (
          <Line
            key={item}
            category={category}
            content={dictionary[item]}
            isBookmarked={bookmarks[category].indexOf(item) !== -1}
            isExpanded={expanded[category].indexOf(item) !== -1}
            onToggleBookmark={_onToggleBookmark}
            onClick={_onExpandLine}/>
        );
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
)(List);
