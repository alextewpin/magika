import styles from './styles.scss';

function Content ({ children }) {
  return (
    <div>{children}</div>
  );
}

Content.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default ReactCSS(Content, styles);
