import React from 'react';

const PageCreator = ({ element }) => {
  const [values, setValues] = React.useState({
    src : 'https://play-lh.googleusercontent.com/qEGURg4vHT05C0O2ZbTfBDoqG0QTUnzfpIgjfYvM4lCVWzKk50FDKzkmtKeAABhl2we4',
    performance : 'Pending click...',
    accessibility : 'Pending click...',
    class : 'Page',
    isClicked : false,
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
    if (element.isMobile) {
      window.open(`http://localhost:8080/api/m/report/${element.title}`, '_blank');
    } else {
      window.open(`http://localhost:8080/api/report/${element.title}`, '_blank');
    }
  };

  const handleImageClick = () => {
    if (values.class !== 'Deleted' && !values.isClicked) {
      setValues({...values,
        src : 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif',
        performance : 'Loading...',
        accessibility : 'Loading...',
        isClicked : true,
      });
      if (element.isMobile) {
        fetch(`/api/m/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            const image = `data:image/png;base64,${res.src}`;
            setValues({...values, src: image, performance: res.performance, accessibility: res.accessibility});
          });
      } else {
        fetch(`/api/metrics/${element._id}`)
          .then((res) => res.json())
          .then((res) => {
            const image = `data:image/png;base64,${res.src}`;
            setValues({...values, src: image, performance: res.performance, accessibility: res.accessibility});
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
    return setValues({...values, class : 'Deleted'});
  };

  return (
    <div className={values.class}>
      <h1>{element.title}</h1>
      <div>{isMobile}</div>
      <div><img src={values.src} alt="Failed to load" onClick={(e)=>handleImageClick()}/></div>
      <div onClick={(e)=>handleClick()}>Performance: {values.performance}</div>
      <div onClick={(e)=>handleClick()}>Accessibility: {values.accessibility}</div>
      <button onClick={(e)=>deletePage()}>Delete</button>
    </div>
  );
};

export default PageCreator;

