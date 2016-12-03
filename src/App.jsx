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
      itemDetails: {},
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleShow = this.handleShow.bind(this);
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
  setFetchedData(obj = {}) {
    return this.setState(
      () => obj,
      () => this.fetchData(
        apiResult => this.setState(() => ({ result: apiResult })),
      ),
    );
  }
  handleInput(e) {
    const newValue = e.target.value;
    return this.setState(() => ({ word: newValue }));
  }
  handleClick() {
    if (this.state.word !== '') {
      return this.setFetchedData();
    }
    return false;
  }
  handleSort(e) {
    const newSort = e.target.value;
    if (this.state.word !== '' && newSort !== this.state.sort) {
      return this.setFetchedData({ sort: newSort });
    }
    return false;
  }
  handleShow(item) {
    this.setState({itemDetails: item});
  }
  render() {
    return (
      <div>
        <header>
          <h1>書籍検索 by 楽天ブックス</h1>
          <BookSearchFormInput
            word={this.state.word}
            handleInput={this.handleInput}
          />
          <BookSearchFormButton handleClick={this.handleClick} />
        </header>
        <div className="item-list">
          <BookSearchResult
            result={this.state.result}
            handleSort={this.handleSort}
            handleShow={this.handleShow}
            sort={this.state.sort}
          />
        </div>
        <div className="item-datails">
          <BookSearchDetails item={this.state.itemDetails} />
        </div>
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
      <label htmlFor="sales">
        <input
          id="sales"
          type="radio" name="sort" value="sales"
          checked={props.sort === 'sales'}
          onChange={props.handleSort}
        /> 売れている順
      </label>
      <label htmlFor="releaseDate">
        <input
          id="releaseDate"
          type="radio" name="sort" value="-releaseDate"
          checked={props.sort === '-releaseDate'}
          onChange={props.handleSort}
        /> 発売順
      </label>
    </div>
  );
};
BookSearchFormRadio.propTypes = {
  sort: React.PropTypes.string,
  handleSort: React.PropTypes.func,
};

const BookSearchResult = (props) => {
  console.log(props.result.length);
  const radioButton = () => {
    if (props.result.length !== 0) {
      return <BookSearchFormRadio handleSort={props.handleSort} sort={props.sort} />;
    }
    return false;
  };
  const itemNodes = props.result.map((item) => (
    <BookSearchItem item={item} key={item.itemUrl} handleShow={props.handleShow} />
  ));
  return (
    <div>
      {radioButton()}
      <div>{itemNodes}</div>
    </div>
  );
};
BookSearchResult.propTypes = {
  result: React.PropTypes.arrayOf(React.PropTypes.object),
  handleSort: React.PropTypes.func,
  sort: React.PropTypes.string,
};

const BookSearchItem = (props) => {
  const handleShow = () => props.handleShow(props.item);
  return (
    <div>
      <a href={props.item.itemUrl} target="_blank" rel="noopener noreferrer">
        <img src={props.item.mediumImageUrl} alt={props.item.title} />
      </a>
      <a href={props.item.itemUrl} target="_blank" rel="noopener noreferrer">{props.item.title}</a>
      <button onClick={handleShow}>詳細を見る</button>
    </div>
  );
};
BookSearchItem.propTypes = {
  item: React.PropTypes.any,
};

const BookSearchDetails = (props) => {
  const item = props.item;
  const itemDetails = () => {
    return (
      <div>
        {item.title}
        {item.author}
        {item.publisherName}
        {item.salesDate}
        <a href={item.itemUrl} target="_blank">購入する</a>
      </div>
    );
  };
  return (
    <div>{ itemDetails() }</div>
  );
};

ReactDom.render(
  <App />,
  document.querySelector('.content')
);
