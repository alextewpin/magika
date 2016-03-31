import List from '_lists/List';

export default function GroupedList ({ fullGroupedList, filteredGroupedList, makeTitleFromIndex, ...rest }) {
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
            {...rest}/>
        );
      })}
    </div>
  );
}
