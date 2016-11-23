import React from 'react';
import ReactDom from 'react-dom';
import fetch from 'node-fetch';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: '',
      result: [],
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  fetchData(callback) {
    fetch(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522?formatVersion=2&applicationId=&keyword=${this.state.word}`, {
      method: 'get',
      mode: 'cors',
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return console.log(response);
    }).then(
      response => callback(response.Items)
    ).catch(
      response => console.log(response)
    );
  }
  handleInput(e) {
    const newValue = e.target.value;
    this.setState(() => ({ word: newValue }));
  }
  handleClick() {
    this.fetchData((apiResult) => {
      this.setState(() => ({ result: apiResult }));
    });
  }
  render() {
    return (
      <div>
        <div>Hello Twitter</div>
        <TwitterFormInput
          word={this.state.word}
          handleInput={this.handleInput}
        />
        <TwitterFormButton handleClick={this.handleClick} />
        <TwitterResult result={this.state.result} />
      </div>
    );
  }
}

const TwitterFormInput = (props) => {
  return (
    <input type="text" placeholder="キーワード" value={props.word} onChange={props.handleInput} />
  );
};
TwitterFormInput.propTypes = {
  word: React.PropTypes.string,
  handleInput: React.PropTypes.func,
};

const TwitterFormButton = (props) => {
  return (
    <button onClick={props.handleClick}>検索</button>
  );
};
TwitterFormButton.propTypes = {
  handleClick: React.PropTypes.func,
};

const TwitterResult = (props) => {
  console.dir(props.result);
  const itemNodes = props.result.map((item) => (
    <Item item={item} key={item.itemUrl} />
  ));
  return (
    <div>{itemNodes}</div>
  );
};
TwitterResult.propTypes = {
  result: React.PropTypes.arrayOf(React.PropTypes.object),
};

const Item = (props) => {
  return (
    <div>
      <a href={props.item.itemUrl} target="_blank"><img src={props.item.mediumImageUrl} alt={props.item.title} /></a>
      <a href={props.item.itemUrl} target="_blank">{props.item.title}</a>
    </div>
  );
}

ReactDom.render(
  <App />,
  document.querySelector('.content')
);
