import styles from './styles.scss';
import cnTools from '_utils/cnTools';
const cn = cnTools(styles);

export default function Description ({ category, content }) {
  function getContent () {
    switch (category) {
      case 'SPELLBOOK':
        return (
          <div className={cn('root')}>
            <Block>
              <Subtitle value={content.schoolAndLevel}/>
            </Block>
            <Block>
              <Item title='Casting Time' value={content.time}/>
              <Item title='Range' value={content.range}/>
              <Item title='Components' value={content.components}/>
              <Item title='Duration' value={content.duration}/>
            </Block>
            <Block>
              <Text value={content.text} hiLevelIndex={content.hiLevelIndex}/>
            </Block>
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <div>
      {getContent()}
    </div>
  );
}

function Block ({ children }) {
  return <div className={cn('block')}>{children}</div>;
}

function Subtitle ({ value }) {
  return <div className={cn('subtitle')}>{value}</div>;
}

function Item ({ title, value }) {
  return (
    <div><span className={cn('item-title')}>{title}</span> {value}</div>
  );
}

function Text ({ value, hiLevelIndex }) {
  function getText (text, hasLevelScaling) {
    if (hasLevelScaling) {
      return <span><strong>At Higher Levels: </strong> {text}</span>;
    }
    return text;
  }
  return (
    <div>
      {value.map((p, i) => {
        return (
          <div key={i} className={cn('p')}>
            {getText(p, (i === hiLevelIndex))}
          </div>
        );
      })}
    </div>
  );
}
