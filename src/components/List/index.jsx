import styles from './styles.scss';

import Line from 'Line';

function List ({
    title,
    link,
    filteredList,
    dictionary,
    isHidden = false,
    extras = null,
    key
  }) {
  return (
    <div key={key} styleName={`root_is-hidden_${isHidden}`}>
      <Line value={title} link={link} style='h2'/>
      {filteredList.map(item => {
        return <Line key={item} value={dictionary[item].name} isHidden={filteredList.indexOf(item) === -1}/>;
      })}
      {extras}
    </div>
  );
}

export default ReactCSS(List, styles);
