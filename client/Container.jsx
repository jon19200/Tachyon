import React from 'react';
import PageCreator from './PageCreator.jsx';

// This component is responsible for rendering all of the page nodes that have been created
const Container = ({ data }) => {
  const PageArray = [];
  data.forEach((element) => PageArray.push(<PageCreator element={element} key={element._id} />));

  return (
    <section className="Container">
      {PageArray}
    </section>
  );
};

export default Container;
