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
    isBookmarked: React.PropTypes.bool.isRequired,
    link: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ])
  }
  shouldComponentUpdate (nextProps) {
    // Make shalow compare later
    return (
      this.props.isExpanded !== nextProps.isExpanded ||
      this.props.isBookmarked !== nextProps.isBookmarked ||
      this.props.value !== nextProps.value ||
      this.props.link !== nextProps.link
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
      case 'CLASSES': {
        const { content: charClass, ...lineBodyProps } = typedLineProps;
        return <LineBody value={charClass.name} {...lineBodyProps}/>;
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
    return (
      <div className={cn('root', { style: 'text' })}>
        <Link className={cn('link')} to={link}>{value}</Link>
      </div>
    );
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
  value: React.PropTypes.string,
  style: React.PropTypes.string,
  link: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  icon: React.PropTypes.string,
  extras: React.PropTypes.array,
  extrasSize: React.PropTypes.string,
  isBookmarked: React.PropTypes.bool,
  isHidden: React.PropTypes.bool,
  onToggleBookmark: React.PropTypes.func,
  onClick: React.PropTypes.func
};
