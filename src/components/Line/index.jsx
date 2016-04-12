import styles from './styles.scss';
import cnTools from '_utils/cnTools';
const cn = cnTools(styles);

import { Link } from 'react-router';
import Description from 'Description';

export default class Line extends React.Component {
  static defaultProps = {
    isExpanded: false,
    isBookmarked: false
  }
  static propTypes = {
    value: React.PropTypes.string,
    category: React.PropTypes.string,
    content: React.PropTypes.object,
    isExpanded: React.PropTypes.bool.isRequired,
    isBookmarked: React.PropTypes.bool.isRequired
  }
  shouldComponentUpdate (nextProps) {
    return (
      this.props.isExpanded !== nextProps.isExpanded ||
      this.props.isBookmarked !== nextProps.isBookmarked ||
      this.props.value !== nextProps.value
    );
  }
  getLineBody () {
    const { category, ...typedLineProps } = this.props;
    switch (category) {
      case 'SPELLBOOK': {
        const { content: spell, ...lineBodyProps } = typedLineProps;
        const extras = [
          spell.ritual ? 'R' : null,
          spell.concentration ? 'C' : null,
          (spell.ritual && !spell.concentration) ? ' ' : null
        ];
        return <LineBody value={spell.name} extras={extras.filter(item => item)} {...lineBodyProps}/>;
      }
      case 'BESTIARY': {
        const { content: monster, ...lineBodyProps } = typedLineProps;
        const extras = [monster.typeShort];
        return <LineBody value={monster.name} extras={extras} extrasSize='m' {...lineBodyProps}/>;
      }
      default:
        return <LineBody {...typedLineProps}/>;
    }
  }
  render () {
    const { isExpanded, ...getLineBodyProps } = this.props;
    const { category, content } = this.props;
    const expandedLine = isExpanded ? <Description {...{ category, content }}/> : null;
    return (
      <div>
        {this.getLineBody(getLineBodyProps)}
        {expandedLine}
      </div>
    );
  }
}

function LineBody ({
    value,
    style = 'normal',
    link,
    icon,
    extras = [],
    extrasSize = 's',
    isBookmarked = false,
    isHidden = false,
    onToggleBookmark,
    onClick
  }) {
  if (link) {
    return <Link className={cn('root', { style: 'link' })} to={link}>{value}</Link>;
  }
  function getStar () {
    if (onToggleBookmark) {
      return <div className={cn('star', { isBookmarked })} onClick={onToggleBookmark}>★</div>;
    }
    return null;
  }
  return (
    <div onClick={onClick} className={cn('root', { style, isHidden })}>
      <div>{value}</div>
      <div className={cn('extras')}>
        {extras.map((item, i) => <div key={i} className={cn('extra', { size: extrasSize })}>{item}</div>)}
        {getStar()}
      </div>
    </div>
  );
}

LineBody.propTypes = {
  value: React.PropTypes.string.isRequired,
  style: React.PropTypes.string,
  link: React.PropTypes.string,
  icon: React.PropTypes.string,
  extras: React.PropTypes.array,
  extrasSize: React.PropTypes.string,
  isBookmarked: React.PropTypes.bool,
  isHidden: React.PropTypes.bool,
  onToggleBookmark: React.PropTypes.func,
  onClick: React.PropTypes.func
};
