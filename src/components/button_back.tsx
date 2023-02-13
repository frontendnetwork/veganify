import Router from 'next/router';

const BackButton = () => (
  <span onClick={() => Router.back()} style={{cursor: "pointer"}} className="icon-left-open back"/>
);

export default BackButton;