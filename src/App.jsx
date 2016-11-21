import React from 'react';
import ReactDom from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>Hello Twitter</div>
        <TwitterForm />
        <TwitterResult />
      </div>
    );
  }
}

const TwitterForm = (props) => {
  return (
    <div>form</div>
  );
};

const TwitterResult = (props) => {
  return (
    <div>result</div>
  );
};

ReactDom.render(
  <App />,
  document.querySelector('.content')
);
