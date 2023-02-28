import React from 'react';
import Container from './Container.jsx';

const App = () => {
  const [data, setData] = React.useState([]);
  const [input, setURL] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);

  // post request to /addURL. Check if mobile or not. Send new URL and isMobile to server. Add response to data array
  const addURL = () => {
    let url = input;
    document.getElementById('input').value = '';
    if (!/^https?:\/\//i.test(input)) {
      url = 'http://' + input;
    }
    if (isMobile) {
      fetch('/api/m/addURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url})
      })
        .then((res) => res.json())
        .then((res) => setData([...data, res]));
    } else {
      console.log('url: ', url);
      fetch('/api/addURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url})
      })
        .then((res) => res.json())
        .then((res) => setData([...data, res]));
    }
    return;
  };

  // when the page loads, make a get request to '/' which clears all image and html files
  React.useEffect(() => {
    fetch('/api/clear', { method : 'GET' });
    return;
  }, []);

  // make get request to '/display' to acquire all previously stored ids, URL's, their titles, and isMobile check as an array of objects
  React.useEffect(() => {
    fetch('/api/display')
      .then((res) => res.json())
      .then((data) => setData(data));
    return;
  });

  return (
    <main id="app">
      <section>
        <h1>Tachyon</h1>
        <form>
          <input type="text" id="input" placeholder="Enter a URL..." onChange={(e) => setURL(e.target.value)}/>
          <input type="checkbox" id="isMobile" name="isMobile" onClick={() => setIsMobile(true)}/>
          <label htmlFor="isMobile">Mobile</label>
          <button type="button" onClick={(e)=>addURL()}>Add</button>
        </form>
      </section>
      <Container data={data}/>
    </main>
  );
};

export default App;