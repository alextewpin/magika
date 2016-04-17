import styles from './styles.scss';
import cnTools from '_utils/cnTools';
const cn = cnTools(styles);

export default function Description ({ category, content }) {
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
    case 'CLASSES':
      return (
        <div className={cn('root')}>
          <Block>
            <Item title='Hit Dice:' value={content.hitDice} style='black'/>
            <Item title='Hit Points at 1st Level:' value={content.hpAtFirstLevel} style='black'/>
            <Item title='Hit Points at Higher Levels:' value={content.hpAtHigherLevels} style='black'/>
          </Block>
          <Block>
            <Item title='Saving Throws:' value={content.proficiency} style='black'/>
          </Block>
          <Slots slots={content.slots} isOptional={content.slotsOptional} ability={content.spellAbility}/>
          <Features features={content.features}/>
        </div>
      );
    default:
      return <div>Missing description case</div>;
  }
}

function Block ({ children, size = 'm' }) {
  return <div className={cn('block', { size })}>{children}</div>;
}

function Subtitle ({ value }) {
  return (
    <Block>
      <div className={cn('subtitle')}>{value}</div>
    </Block>
  );
}

function Item ({ title, value, style = 'red' }) {
  if (value) {
    return (
      <div><span className={cn('item-title', { style })}>{title}</span> {value}</div>
    );
  }
  return <span/>;
}

function Traits ({ title, value = [] }) {
  if (value.length === 0) {
    return <span/>;
  }
  function getTitle () {
    if (title) {
      return <div className={cn('h3')}>{title}</div>;
    }
    return null;
  }
  return (
    <Block size='l'>
      {getTitle()}
      {value.map((trait, i) => {
        return <Text key={i} {...trait}/>;
      })}
    </Block>
  );
}

Traits.propTypes = {
  title: React.PropTypes.string,
  value: React.PropTypes.array
};

function Text ({ title, value, isOptional, hiLevelIndex }) {
  function getTitle (i) {
    if (i === hiLevelIndex) {
      return 'At Higher Levels: ';
    }
    if (i === 0 && title) {
      if (isOptional) {
        return `${title}.* `;
      }
      return `${title}. `;
    }
    return '';
  }
  return (
    <Block>
      {value.map((p, i) => {
        return (
          <div key={i} className={cn('p')}>
            <strong>{getTitle(i)}</strong>{p}
          </div>
        );
      })}
    </Block>
  );
}

function Stats ({ str, dex, con, int, wis, cha }) {
  return (
    <Block>
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
    </Block>
  );
}

function Slots ({ slots, isOptional, ability }) {
  if (!slots) {
    return <span/>;
  }
  const title = (isOptional) ? 'Spellcasting*' : 'Spellcasting';
  return (
    <Block size='l'>
      <div className={cn('h3')}>{title}</div>
      <Block>
        <Item title='Spellcasting Ability:' value={ability} style='black'/>
        <Block>
          <div className={cn('slots-row')}>
            <div className={cn('slots-title')}></div>
            {[...Array(slots[19].length) + 1].map((_, i) => {
              let slotTitle = (i === 0) ? 'CT' : String(i);
              return <div key={i} className={cn('slots-title')}>{slotTitle}</div>;
            })}
          </div>
          {slots.map((level, i) => {
            if (level.length === 0) {
              return null;
            }
            return (
              <div key={i} className={cn('slots-row')}>
                <div className={cn('slots-title')}>{i + 1}</div>
                {level.map((slot, k) => {
                  if (slot === '0') {
                    return <div key={k} className={cn('slots-empty')}>•</div>;
                  }
                  return <div key={k}>{slot}</div>;
                })}
              </div>
            );
          })}
        </Block>
      </Block>
    </Block>
  );
}

function Features ({ features }) {
  return (
    <Block>
      {features.map((level, i) => {
        return (
          <div key={i}>
            <Traits title={`Level ${i + 1}`} value={level}/>
          </div>
        );
      })}
    </Block>
  );
}
