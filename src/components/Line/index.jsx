import styles from './styles.scss';

import { Link } from 'react-router';

function Line ({
    value,
    style = 'normal',
    link,
    icon,
    mods,
    isBookmaked = false,
    isHidden = false,
    onBookmark,
    onClick 
  }) {
  if (link) {
    return <Link styleName='root_style_link' to={link}>{value}</Link>;
  }
  return (
    <div onClick={onClick} styleName={`root_style_${style} root_is-hidden_${isHidden}`}>{value}</div>
  );
}

export default ReactCSS(Line, styles, { allowMultiple: true });
