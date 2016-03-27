import styles from './styles.scss';

import { Link } from 'react-router';

function Nav ({ title }) {
  let _title;
  if (title) {
    _title = <span styleName='title'>&nbsp;→ {title}</span>;
  }
  let _bookmarks;
  if (title !== 'bookmarks') {
    _bookmarks = <Link to='/bookmarks' styleName='bookmarks'>Bookmarks</Link>;
  }
  return (
    <div styleName='root'>
      <div styleName='breadcrumbs'>
        <div>
          <Link to='/app' styleName='logo'>Magika</Link>
          {_title}
        </div>
      </div>
      {_bookmarks}
    </div>
  );
}

Nav.propTypes = {
  title: React.PropTypes.string
};

export default ReactCSS(Nav, styles);
