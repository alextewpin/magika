import GroupedList from '_lists/GroupedList';

export default function BestiaryList (props) {
  function makeCRFromIndex (index) {
    switch (index) {
      case 0: return '0';
      case 1: return '1/8';
      case 2: return '1/4';
      case 3: return '1/2';
      default: return String(index - 3);
    }
  }
  function makeTitleFromIndex (index) {
    return `Challenge ${makeCRFromIndex(index)}`;
  }
  return <GroupedList {...{ makeTitleFromIndex }} {...props}/>;
}
