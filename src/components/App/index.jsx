import styles from './styles.scss';

import Nav from 'Nav';

const asd = { foo: 'asd', bar: 'qwe' };
const qwe = { ...asd };

function App ({ children }) {
  return (
    <div>
      <Nav/>
      <div>{qwe.foo}</div>
      <div>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: React.PropTypes.any
};

export default ReactCSS(App, styles);
