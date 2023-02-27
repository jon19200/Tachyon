import React from 'react';
import Container from './MainContainer';

const App = () => {
  const [data, setData] = React.useState([]);
  let url = '';
  let isMobile = false;

  // post request to /addURL. Check if mobile or not. Send new URL and isMobile to server. Add response to data array
  const addURL = () => {
    fetch('/addURL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url, isMobile})
    })
      .then((res) => res.json())
      .then((res) => setData([...data, res]));
  };

  // When react first mounts, make get request to '/display' to acquire all previously stored ids, URL's, their titles, and isMobile check as an array of objects
  React.useEffect(() => {
    fetch('/display')
      .then((res) => res.json())
      .then((data) => setData(data));
  });

  return (
    <main id="app">
      <section>
        <h1>Tachyon</h1>
        <form>
          <input type="text" placeholder="Enter a URL..." onChange={(input) => url = input}/>
          <input type="checkbox" id="isMobile" name="isMobile" onClick={() => isMobile = !isMobile}/>
          <label htmlFor="isMobile">Mobile</label>
          <button type="button" onClick={addURL(url, isMobile)}>Add</button>
        </form>
      </section>
      <Container data={data}/>
    </main>
  );
};

export default App;