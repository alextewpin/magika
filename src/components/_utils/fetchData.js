import axios from 'axios';

export default function fetchData (onSuccess) {
  axios.all([
    axios.get('/data-bestiary.json'),
    axios.get('/data-classes.json'),
    axios.get('/data-spellbook.json')
  ])
  .then(res => {
    onSuccess(res.reduce((prev, current) => {
      return { ...prev, ...current.data };
    }, {}));
  })
  .catch(err => {
    console.log(err);
  });
}
