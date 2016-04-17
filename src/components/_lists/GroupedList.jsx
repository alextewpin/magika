import List from '_lists/List';
import Line from 'Line';

export default function GroupedList ({
  title,
  isEmpty = false,
  fullGroupedList,
  filteredGroupedList,
  makeTitleFromIndex,
  ...rest
}) {
  return (
    <div>
      {title && !isEmpty ?
        <Line value={title} style='h1'/> : null}
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
