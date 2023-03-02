import React from 'react';
import Container from './Container.jsx';

const App = () => {
  const [data, setData] = React.useState([]);
  const [input, setURL] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const [pending, setPending] = React.useState([]);
  const [error, setError] = React.useState(false);

  // Gather URL from input field and make a post request to '/addURL' with the URL as a JSON object
  const addURL = () => {
    let url = input;
    document.getElementById('input').value = '';
    if (!/^https?:\/\//i.test(input)) {
      url = 'http://' + input;
    }
    const pendingPromises = [...pending];
    pendingPromises.push(url);
    setPending(pendingPromises);
    setURL('');
    setError(false);
    // if the isMobile checkbox is checked, make a post request to '/m/addURL' with the URL as a JSON object
    if (isMobile) {
      setIsMobile(false);
      document.getElementById('isMobile').checked = false;
      fetch('/api/m/addURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url})
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.err) {
            setError(true);
            const pendingPromises = [...pending];
            pendingPromises.splice(pendingPromises.indexOf(url), 1);
            setPending(pendingPromises);
            return;
          }
          setData([...data, res]);
          const pendingPromises = [...pending];
          pendingPromises.splice(pendingPromises.indexOf(url), 1);
          setPending(pendingPromises);
          return res;
        });
    } else {
      fetch('/api/addURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url})
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.err) {
            setError(true);
            const pendingPromises = [...pending];
            pendingPromises.splice(pendingPromises.indexOf(url), 1);
            setPending(pendingPromises);
            return;
          }
          setData([...data, res]);
          const pendingPromises = [...pending];
          pendingPromises.splice(pendingPromises.indexOf(url), 1);
          setPending(pendingPromises);
        });
    }
    return;
  };

  // when the page loads, make a get request to '/' which clears all stored images and html files
  React.useEffect(() => {
    fetch('/api/clear', { method : 'GET' });
    return;
  }, []);

  // fetch all page data from the server and set it to the data state
  React.useEffect(() => {
    fetch('/api/display')
      .then((res) => res.json())
      .then((data) => setData(data));
    return;
  }, [data]);

  React.useEffect(() => {
    const loading = document.getElementById('loading');
    if (error) {
      loading.innerHTML = '&nbsp;&nbsp;&nbsp;URL could not be found . . .';
      loading.style.color = 'rgb(255, 51, 51)';
    } else if (pending.length > 0) {
      loading.style.color = '#F5F1E3';
      loading.innerHTML = '&nbsp;&nbsp;&nbsp;Loading . . .';
    } else {
      loading.innerHTML = '';
    }
  }, [pending, error]);

  return (
    <main id="app">
      <section>
        <h1>Tachyon</h1>
        <form>
          <input type="text" id="input" placeholder="Enter a URL..." onChange={(e) => setURL(e.target.value)}/>
          <input type="text" id="preventEnterKey"/>
          <div>
            <input type="checkbox" id="isMobile" name="isMobile" onClick={() => setIsMobile(true)}/>
            <label htmlFor="isMobile">Mobile</label>
          </div>
          <button id='submitButton' type="button" onClick={(e)=>addURL()}>Add</button>
          <b id="loading"></b>
        </form>
      </section>
      <Container data={data}/>
    </main>
  );
};

export default App;