import GroupedList from '_lists/GroupedList';

export default function BestiaryList (props) {
  function makeTitleFromIndex (index) {
    switch (index) {
      case 0: return 'Common';
      case 1: return 'Uncommon';
      case 2: return 'Rare';
      case 3: return 'Very Rare';
      case 4: return 'Legendary';
      case 5: return 'Artifact';
      case 6: return 'Other';
      default: return 'Unknown';
    }
  }
  return <GroupedList {...{ makeTitleFromIndex }} {...props}/>;
}
