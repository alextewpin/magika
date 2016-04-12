import styles from './styles.scss';
import cnTools from '_utils/cnTools';
const cn = cnTools(styles);

export default function Description ({ category, content }) {
  function getContent () {
    switch (category) {
      case 'SPELLBOOK':
        return (
          <div className={cn('root')}>
            <Subtitle value={content.schoolAndLevel}/>
            <Block>
              <Item title='Casting Time' value={content.time}/>
              <Item title='Range' value={content.range}/>
              <Item title='Components' value={content.components}/>
              <Item title='Duration' value={content.duration}/>
            </Block>
            <Text value={content.text} hiLevelIndex={content.hiLevelIndex}/>
          </div>
        );
      case 'BESTIARY':
        return (
          <div className={cn('root')}>
            <Subtitle value={`${content.sizeFull} ${content.type}, ${content.alignment}`}/>
            <Block>
              <Item title='Armor Class' value={content.ac}/>
              <Item title='Hit Points' value={content.hp}/>
              <Item title='Speed' value={content.speed}/>
            </Block>
            <Stats {...content.stats}/>
            <Block>
              <Item title='Saving Throws' value={content.save}/>
              <Item title='Damage Vulnerables' value={content.vulnerable}/>
              <Item title='Damage Resistances' value={content.resist}/>
              <Item title='Damage Immunities' value={content.immune}/>
              <Item title='Condition Immunities' value={content.conditionImmune}/>
              <Item title='Skills' value={content.skill}/>
              <Item title='Senses' value={content.senses}/>
              <Item title='Languages' value={content.languages}/>
              <Item title='Challenge' value={content.cr}/>
            </Block>
            <Traits value={content.trait}/>
            <Traits title='Actions' value={content.action}/>
            <Traits title='Legengary Actions' value={content.legendary}/>
            <Traits title='Reactions' value={content.reaction}/>
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
  return (
    <div className={cn('block')}>
      <div className={cn('subtitle')}>{value}</div>
    </div>
  );
}

function Item ({ title, value }) {
  if (value) {
    return (
      <div><span className={cn('item-title')}>{title}</span> {value}</div>
    );
  }
  return <span/>;
}

function Stats ({ str, dex, con, int, wis, cha }) {
  return (
    <div className={cn('block')}>
      <div className={cn('stats-titles')}>
        <div>STR</div>
        <div>DEX</div>
        <div>CON</div>
        <div>INT</div>
        <div>WIS</div>
        <div>CHA</div>
      </div>
      <div className={cn('stats-values')}>
        <div>{str}</div>
        <div>{dex}</div>
        <div>{con}</div>
        <div>{int}</div>
        <div>{wis}</div>
        <div>{cha}</div>
      </div>
    </div>
  );
}

function Traits ({ title, value = [] }) {
  if (value.length === 0) {
    return <span/>;
  }
  function getTitle () {
    if (title) {
      return <div className={cn('traits-title')}>{title}</div>;
    }
    return null;
  }
  return (
    <div className={cn('traits')}>
      {getTitle()}
      {value.map((trait, i) => {
        return <Text key={i} {...trait}/>;
      })}
    </div>
  );
}

Traits.propTypes = {
  title: React.PropTypes.string,
  value: React.PropTypes.array
};

function Text ({ title = '', value, key, hiLevelIndex }) {
  function getText (text, i) {
    if (i === hiLevelIndex) {
      return <span><strong>At Higher Levels: </strong> {text}</span>;
    }
    if (i === 0 && title !== '') {
      return <span><strong>{title}. </strong> {text}</span>;
    }
    return text;
  }
  return (
    <div key={key} className={cn('block')}>
      {value.map((p, i) => {
        return (
          <div key={i} className={cn('p')}>
            {getText(p, i)}
          </div>
        );
      })}
    </div>
  );
}
