import GroupedList from '_lists/GroupedList';

export default function SpellbookList (props) {
  function makeTitleFromIndex (index) {
    if (index === 0) {
      return 'Cantrips';
    } else {
      return `Level ${index}`;
    }
  }
  return <GroupedList {...{ makeTitleFromIndex }} {...props}/>;
}
