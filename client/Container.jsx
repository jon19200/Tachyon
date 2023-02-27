import React from 'react';
import PageCreator from './PageCreator';

const Container = ({ data }) => {
  const PageArray = [];
  // - loop through objects invoking the componentCreator on each one. Args are (element, index)
  // - will add a JSX element to an array
  data.forEach((element, index) => {
    PageArray.push(<PageCreator index={index} element={element} />);
  });

  return (
    <section id="Container">
      {PageArray}
    </section>
  );
};

export default Container;
