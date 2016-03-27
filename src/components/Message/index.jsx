import styles from './styles.scss';

import Line from 'Line';

function Message ({ type }) {
  switch (type) {
    case 'NOT_FOUND':
      return <Line value='The matter is wrapped in mystery...' style='text'/>;
    default: return null;
  }
}

export default ReactCSS(Message, styles);
