import React from 'react';
import PageCreator from './PageCreator.jsx';

const Container = ({ data }) => {
  const PageArray = [];
  // - loop through objects invoking the componentCreator on each one. Args are (element)
  data.forEach((element) => PageArray.push(<PageCreator element={element} key={element._id} />));

  return (
    <section id="Container">
      {PageArray}
    </section>
  );
};

export default Container;
