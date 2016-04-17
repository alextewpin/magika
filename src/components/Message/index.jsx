import styles from './styles.scss';

import Line from 'Line';

function Message ({ type }) {
  switch (type) {
    case 'NOT_FOUND':
      return <Line value='The matter is wrapped in mystery...' style='text'/>;
    case 'EMPTY':
      return <Line value='There is nothing here' style='text'/>;
    default:
      return <Line value='Message without type' style='text'/>;
  }
}

export default ReactCSS(Message, styles);
