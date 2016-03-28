import styles from './styles.scss';

import { Link } from 'react-router';

export function SpellLine ({ spell, isExpanded = false, ...rest }) {
  const extras = [
    spell.ritual ? 'R' : null,
    spell.concentration ? 'C' : null,
    (spell.ritual && !spell.concentration) ? ' ' : null
  ];
  const expandedLine = isExpanded ? <div>!!!</div> : null;
  return (
    <div>
      <Line value={spell.name} extras={extras.filter(item => item)} {...rest}/>
      {expandedLine}
    </div>
  );
}

function LineComponent ({
    value,
    style = 'normal',
    link,
    icon,
    extras = [],
    isBookmarked = false,
    isHidden = false,
    onToggleBookmark,
    onExpandLine
  }) {
  if (link) {
    return <Link styleName='root_style_link' to={link}>{value}</Link>;
  }
  function getStar () {
    if (onToggleBookmark) {
      return <div styleName={`star_is-bookmarked_${isBookmarked}`} onClick={onToggleBookmark}>★</div>;
    }
    return null;
  }
  return (
    <div onClick={onExpandLine} styleName={`root_style_${style} root_is-hidden_${isHidden}`}>
      <div>{value}</div>
      <div styleName='extras'>
        {extras.map((item, i) => <div key={i} styleName='extra'>{item}</div>)}
        {getStar()}
      </div>
    </div>
  );
}

LineComponent.displayName = 'Line';

export const Line = ReactCSS(LineComponent, styles, { allowMultiple: true });
