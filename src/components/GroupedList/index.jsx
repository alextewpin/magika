import List from 'List';

export default function GroupedList ({ fullGroupedList, filteredGroupedList, dictionary, makeTitleFromIndex }) {
  return (
    <div>
      {fullGroupedList.map((fullList, i) => {
        return (
          <List
            key={i}
            isHidden={!(filteredGroupedList[i].length > 0)}
            title={makeTitleFromIndex(i)}
            filteredList={filteredGroupedList[i]}
            fullList={fullList}
            dictionary={dictionary}/>
        );
      })}
    </div>
  );
}
