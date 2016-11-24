import React from 'react';
import ReactDom from 'react-dom';
import fetch from 'node-fetch';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      word: '',
      sort: 'sales',
      result: [],
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }
  fetchData(callback) {
    const params = '?'
      + 'formatVersion=2'
      + '&applicationId=10cb3e01455a16aef15a3381f015fdab'
      + `&sort=${this.state.sort}`
      + `&keyword=${this.state.word}`;

    fetch(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20130522${params}`, {
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
  handleSort(e) {
    const newSort = e.target.value;
    console.log(newSort);
    this.setState(() => ({ sort: newSort }));
    return this.fetchData((apiResult) => {
      this.setState(() => ({ result: apiResult }));
    });
  }
  render() {
    return (
      <div>
        <h1>書籍検索 by 楽天ブックス</h1>
        <BookSearchFormInput
          word={this.state.word}
          handleInput={this.handleInput}
        />
        <BookSearchFormButton handleClick={this.handleClick} />
        <BookSearchFormRadio handleSort={this.handleSort} />
        <BookSearchResult result={this.state.result} />
      </div>
    );
  }
}

const BookSearchFormInput = (props) => {
  return (
    <input type="text" placeholder="キーワード" value={props.word} onChange={props.handleInput} />
  );
};
BookSearchFormInput.propTypes = {
  word: React.PropTypes.string,
  handleInput: React.PropTypes.func,
};

const BookSearchFormButton = (props) => {
  return (
    <button onClick={props.handleClick}>検索</button>
  );
};
BookSearchFormButton.propTypes = {
  handleClick: React.PropTypes.func,
};

const BookSearchFormRadio = (props) => {
  return (
    <div>
      <label><input type="radio" name="sort" value="sales" onChange={props.handleSort} /> 売れている</label>
      <label><input type="radio" name="sort" value="+releaseDate" onChange={props.handleSort} /> 発売日（新しい）</label>
      <label><input type="radio" name="sort" value="-releaseDate" onChange={props.handleSort} /> 発売日（古い）</label>
    </div>
  );
};

const BookSearchResult = (props) => {
  console.dir(props.result);
  const itemNodes = props.result.map((item) => (
    <BookSearchItem item={item} key={item.itemUrl} />
  ));
  return (
    <div>{itemNodes}</div>
  );
};
BookSearchResult.propTypes = {
  result: React.PropTypes.arrayOf(React.PropTypes.object),
};

const BookSearchItem = (props) => {
  return (
    <div>
      <a href={props.item.itemUrl} target="_blank" rel="noopener noreferrer">
        <img src={props.item.mediumImageUrl} alt={props.item.title} />
      </a>
      <a href={props.item.itemUrl} target="_blank" rel="noopener noreferrer">{props.item.title}</a>
    </div>
  );
};
BookSearchItem.propTypes = {
  item: React.PropTypes.any,
};

ReactDom.render(
  <App />,
  document.querySelector('.content')
);
