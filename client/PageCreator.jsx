import React from 'react';

const PageCreator = ({ index, element }) => {

  const [values, setValues] = React.useState({
    src : 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif',
    performance : 'Loading...',
    accessibility : 'Loading...',
    class : 'Page',
  });
  let isMobile;

  if (element.isMobile) {
    isMobile = 'Mobile';
    fetch(`/m/metrics/${element.url}`)
      .then((res) => res.json())
      .then((res) => setValues({...values, src: res.src, performance: res.performance, accessibility: res.accessibility}));
  } else {
    isMobile = 'Desktop';
    fetch(`/metrics/${element.url}`)
      .then((res) => res.json())
      .then((res) => setValues({...values, src: res.src, performance: res.performance, accessibility: res.accessibility}));
  }

  // - Hover performance or accessibility divs to see message 'Open a new tab for details'
  // - Click to duplicate tab adding `/report/${title}` to it where title is the title of the html report
  //             Maybe use window.open('http://localhost:3000/report/${title}', '_blank')

  const handleClick = () => {
    window.open(`http://localhost:3000/report/${element.title}`, '_blank');
  };

  // - Click delete button to delete the page from the database
  const deletePage = (id) => {
    fetch(`/delete/${id}`, {
      method: 'DELETE'
    });
    setValues({...values, class: 'Deleted'});
  };

  return (
    <div className={values.class}>
      <h1>{element.title}</h1>
      <div>{isMobile}</div>
      <div><img src={values.src} alt="Loading..." /></div>
      <div onClick={handleClick()}>Performance: {values.performance}</div>
      <div onClick={handleClick()}>Accessibility: {values.accessibility}</div>
      <button onClick={deletePage(element._id)}>Delete</button>
    </div>
  );
};

export default PageCreator;

