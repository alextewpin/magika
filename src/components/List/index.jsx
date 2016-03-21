import styles from './styles.scss';

import Line from 'Line';

function List ({ title, link, list, dictionary, maxLength = 0 }) {
  if (list.length === 0) {
    return null;
  }
  function getTitle () {
    if (link) {
      return <Line value={title} link={link}/>;
    }
    return <Line value={title}/>;
  }
  function getShowMore () {
    if (maxLength !== 0 && list.length > maxLength) {
      return <Line value={`Show ${list.length - maxLength} more`} style='show-more'/>;
    }
    return null;
  }
  return (
    <div styleName='root_have-separator_true'>
      {getTitle()}
      {list.map((item, i) => {
        if (maxLength !== 0 && i + 1 <= maxLength) {
          return <Line key={dictionary[item].url} value={dictionary[item].name}/>;
        }
        return null;
      })}
      {getShowMore()}
    </div>
  );
}

export default ReactCSS(List, styles);
