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

  // Opens a new tab with the report for the page
  const handleClick = () => {
    if (values.hasLoaded) {
      if (element.isMobile) {
        window.open(`http://localhost:3000/api/m/report/${element.title}`, '_blank');
      } else {
        window.open(`http://localhost:3000/api/report/${element.title}`, '_blank');
      }
    }
  };
  
  // Opens a new tab with the url for the page
  const handleOpenLink = () => {
    window.open(element.url, '_blank');
  };
    

  // fetches the screenshot for the page and sets the src state to the image
  React.useEffect(() => {
    if (element.isMobile) {
      fetch(`/api/m/screenshot/${element._id}`)
        .then((res) => res.json())
        .then((res) => {
          const image = `data:image/png;base64,${res.src}`;
          document.getElementById(`img:${element._id}`).style.cursor = 'pointer';
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
          document.getElementById(`img:${element._id}`).style.cursor = 'pointer';
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

  // fetches the performance and accessibility metrics for the page and sets the performance and accessibility states to the metrics
  const handleImageClick = () => {
    if (values.class !== 'Deleted' && !values.isClicked) {
      document.getElementById(`img:${element._id}`).style.cursor = 'default';
      let performance = document.getElementById(`performance:${element._id}`);
      let accessibility = document.getElementById(`accessibility:${element._id}`);
      performance.style.color = 'white';
      accessibility.style.color = 'white';
      performance.style.cursor = 'default';
      accessibility.style.cursor = 'default';
      setValues({
        ...values,
        performance : 'Loading...',
        accessibility : 'Loading...',
        hasLoaded : false,
        isClicked : true
      });
      // fetches the metrics for the page if it is mobile
      if (element.isMobile) {
        fetch(`/api/m/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            // if the metrics are strings, then there was an error
            if (typeof res.performance === 'string' || typeof res.accessibility === 'string') {
              performance.style.color = 'rgb(255, 51, 51)';
              accessibility.style.color = 'rgb(255, 51, 51)';
              performance.style.fontWeight = 'bold';
              accessibility.style.fontWeight = 'bold';
              performance.style.cursor = 'default';
              accessibility.style.cursor = 'default';
              setValues({
                ...values,
                performance: res.performance,
                accessibility: res.accessibility,
                hasLoaded: false
              });
            } else {
              // changes the color of the text based on the score
              if (res.performance <= 49) {
                performance.style.color = 'rgb(255, 51, 51)';
              } else if (res.performance <= 89) {
                performance.style.color = 'rgb(255, 170, 51)';
              } else {
                performance.style.color = 'rgb(0, 204, 102)';
              }
              if (res.accessibility <= 49) {
                accessibility.style.color = 'rgb(255, 51, 51)';
              } else if (res.accessibility <= 89) {
                accessibility.style.color = 'rgb(255, 170, 51)';
              } else {
                accessibility.style.color = 'rgb(0, 204, 102)';
              }
              performance.style.fontWeight = 'bold';
              performance.style.cursor = 'pointer';
              accessibility.style.fontWeight = 'bold';
              accessibility.style.cursor = 'pointer';
              performance = `${res.performance}%`;
              accessibility = `${res.accessibility}%`;
              setValues({
                ...values,
                performance,
                accessibility,
                hasLoaded: true
              });
            }
            document.getElementById(`img:${element._id}`).style.cursor = 'pointer';
          });
      } else {
        // fetches the metrics for the page if it is desktop
        fetch(`/api/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            if (typeof res.performance === 'string' || typeof res.accessibility === 'string') {
              performance.style.color = 'rgb(255, 51, 51)';
              accessibility.style.color = 'rgb(255, 51, 51)';
              performance.style.fontWeight = 'bold';
              accessibility.style.fontWeight = 'bold';
              performance.style.cursor = 'default';
              accessibility.style.cursor = 'default';
              setValues({
                ...values,
                performance: res.performance,
                accessibility: res.accessibility,
                hasLoaded: false
              });
            } else {
              if (res.performance <= 49) {
                performance.style.color = 'rgb(255, 51, 51)';
              } else if (res.performance <= 89) {
                performance.style.color = 'rgb(255, 170, 51)';
              } else {
                performance.style.color = 'rgb(0, 204, 102)';
              }
              if (res.accessibility <= 49) {
                accessibility.style.color = 'rgb(255, 51, 51)';
              } else if (res.accessibility <= 89) {
                accessibility.style.color = 'rgb(255, 170, 51)';
              } else {
                accessibility.style.color = 'rgb(0, 204, 102)';
              }
              performance.style.fontWeight = 'bold';
              performance.style.cursor = 'pointer';
              accessibility.style.fontWeight = 'bold';
              accessibility.style.cursor = 'pointer';
              performance = `${res.performance}%`;
              accessibility = `${res.accessibility}%`;
              setValues({
                ...values,
                performance,
                accessibility,
                hasLoaded: true
              });
            }
            document.getElementById(`img:${element._id}`).style.cursor = 'pointer';
          });
      }
    }
    return;
  };

  // deletes the page from the database and sets the class state to 'Deleted' to hide the page
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
      <div className='Title'>
        <b onClick={(e)=>handleOpenLink()}>{element.title}</b>
        <div>{isMobile}</div>
      </div>
      <div><img className='Img' id={`img:${element._id}`} src={values.src} alt="Failed to load" onClick={(e)=>handleImageClick()}/></div>
      <div className='Stats'>
        <div>
          <span className='Metric'><b>Performance: </b></span>
          <span id={`performance:${element._id}`} onClick={(e)=>handleClick()}>{values.performance}</span>
        </div>
        <div>
          <span className='Metric'><b>Accessibility: </b></span>
          <span id={`accessibility:${element._id}`} onClick={(e)=>handleClick()}>{values.accessibility}</span>
        </div>
        <button className='Delete' onClick={(e)=>deletePage()}>Delete</button>
      </div>
    </div>
  );
};

export default PageCreator;

