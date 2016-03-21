import styles from './styles.scss';

import { Link } from 'react-router';

function Line ({ value, style = 'normal', link, icon, mods, isBookmaked = false, onBookmark }) {
  if (link) {
    return <Link styleName='root_style_link' to={link}>{value}</Link>;
  }
  return (
    <div styleName={`root_style_${style}`}>{value}</div>
  );
}

export default ReactCSS(Line, styles);
