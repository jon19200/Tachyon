import React from 'react';

const PageCreator = ({ element }) => {
  const [values, setValues] = React.useState({
    src : 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif',
    performance : 'Pending load...',
    accessibility : 'Pending load...',
    class : 'Page',
    isClicked : true,
    hasLoaded : false
  });

  let isMobile;
  if (element.isMobile) {
    isMobile = 'Mobile';
  } else {
    isMobile = 'Desktop';
  }


  // - Hover performance or accessibility divs to see message 'Open a new tab for details'
  // - Click to duplicate tab adding `/report/${title}` to it where title is the title of the html report
  //             Maybe use window.open('http://localhost:3000/report/${title}', '_blank')

  const handleClick = () => {
    if (values.hasLoaded) {
      if (element.isMobile) {
        window.open(`http://localhost:3000/api/m/report/${element.title}`, '_blank');
      } else {
        window.open(`http://localhost:3000/api/report/${element.title}`, '_blank');
      }
    }
  };

  // Separate screenshot feature from metrics. Load screenshots as soon as you get the title url and what not for page creation.
  React.useEffect(() => {
    if (element.isMobile) {
      fetch(`/api/m/screenshot/${element._id}`)
        .then((res) => res.json())
        .then((res) => {
          const image = `data:image/png;base64,${res.src}`;
          setValues({
            ...values,
            src: image,
            isClicked : false,
            performance : 'Click image...',
            accessibility : 'Click image...'
          });
        });
    } else {
      fetch(`/api/screenshot/${element._id}`)
        .then((res) => res.json())
        .then((res) => {
          const image = `data:image/png;base64,${res.src}`;
          setValues({
            ...values,
            src: image,
            isClicked: false,
            performance : 'Click image...',
            accessibility : 'Click image...'
          });
        });
    }
  }, []);

  const handleImageClick = () => {
    if (values.class !== 'Deleted' && !values.isClicked) {
      document.getElementById(`performance:${element._id}`).style.color = 'black';
      document.getElementById(`accessibility:${element._id}`).style.color = 'black';
      setValues({
        ...values,
        performance : 'Loading...',
        accessibility : 'Loading...',
        isClicked : true
      });
      if (element.isMobile) {
        fetch(`/api/m/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            if (typeof res.performance === 'string' || typeof res.accessibility === 'string') {
              document.getElementById(`performance:${element._id}`).style.color = 'red';
              document.getElementById(`accessibility:${element._id}`).style.color = 'red';
              setValues({
                ...values,
                performance: res.performance,
                accessibility: res.accessibility,
                hasLoaded: true
              });
            } else {
              if (res.performance <= 49) {
                document.getElementById(`performance:${element._id}`).style.color = 'red';
              } else if (res.performance <= 89) {
                document.getElementById(`performance:${element._id}`).style.color = 'orange';
              } else {
                document.getElementById(`performance:${element._id}`).style.color = 'green';
              }
              if (res.accessibility <= 49) {
                document.getElementById(`accessibility:${element._id}`).style.color = 'red';
              } else if (res.accessibility <= 89) {
                document.getElementById(`accessibility:${element._id}`).style.color = 'orange';
              } else {
                document.getElementById(`accessibility:${element._id}`).style.color = 'green';
              }
              const performance = `${res.performance}%`;
              const accessibility = `${res.accessibility}%`;
              setValues({
                ...values,
                performance,
                accessibility,
                hasLoaded: true
              });
            }
          });
      } else {
        fetch(`/api/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            if (typeof res.performance === 'string' || typeof res.accessibility === 'string') {
              document.getElementById(`performance:${element._id}`).style.color = 'red';
              document.getElementById(`accessibility:${element._id}`).style.color = 'red';
              setValues({
                ...values,
                performance: res.performance,
                accessibility: res.accessibility,
                hasLoaded: true
              });
            } else {
              if (res.performance <= 49) {
                document.getElementById(`performance:${element._id}`).style.color = 'red';
              } else if (res.performance <= 89) {
                document.getElementById(`performance:${element._id}`).style.color = 'orange';
              } else {
                document.getElementById(`performance:${element._id}`).style.color = 'green';
              }
              if (res.accessibility <= 49) {
                document.getElementById(`accessibility:${element._id}`).style.color = 'red';
              } else if (res.accessibility <= 89) {
                document.getElementById(`accessibility:${element._id}`).style.color = 'orange';
              } else {
                document.getElementById(`accessibility:${element._id}`).style.color = 'green';
              }
              const performance = `${res.performance}%`;
              const accessibility = `${res.accessibility}%`;
              setValues({
                ...values,
                performance,
                accessibility,
                hasLoaded: true
              });
            }
          });
      }
    }
    return;
  };

  // - Click delete button to delete the page from the database
  const deletePage = () => {
    const id = element._id;
    fetch(`/api/delete/${id}`, {
      method: 'DELETE'
    });
    return setValues({
      ...values,
      class : 'Deleted'
    });
  };

  return (
    <div className={values.class}>
      <h1>{element.title}</h1>
      <div>{isMobile}</div>
      <div><img src={values.src} alt="Failed to load" onClick={(e)=>handleImageClick()}/></div>
      <div id={`performance:${element._id}`} onClick={(e)=>handleClick()}>Performance: {values.performance}</div>
      <div id={`accessibility:${element._id}`} onClick={(e)=>handleClick()}>Accessibility: {values.accessibility}</div>
      <button onClick={(e)=>deletePage()}>Delete</button>
    </div>
  );
};

export default PageCreator;

