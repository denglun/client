import React, { Component } from 'react';
import './App.css';
import compressor from './compressor';


class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { msg: '' };
  }

  remove(pid) {
    if (confirm("delete?")) {
      this.setState({ msg: 'deleting...' });
      fetch("./posts/" + pid, { method: 'delete' }).then(response => response.json())
        .then(res => this.setState(res));
    }
  }
  removeImg(id) {
    const img = document.getElementById(id).getElementsByClassName("image")[0];
    img.style.display = 'none';
  }
  render() {
    const { id, title, time, content } = this.props;
    const { msg } = this.state;
    if (msg) {
      return <div> {msg}
        <hr /></div>;
    }
    let timeString = new Date(time).toLocaleString();
    timeString = timeString.split('GMT')[0];
    return (<div className="post" id={id}>
      <h3 className="title">{title}</h3>
      <div className="post-time">{timeString}</div>
      <div className="image"> 
        <img src={"./posts/" + id + "/image"} alt=":)" onError={this.removeImg.bind(this, [id])} />
        </div>
      <div className="content">{content}</div>
      <button type="button" onClick={this.remove.bind(this, [id])} >DELELE</button>
      <hr />
    </div>);
  };

}
class App extends Component {

  constructor(props) {
    super(props);
    this.state = { msg: '', posts: [] };
  }

  last() {
    this.setState({ msg: 'loading...', posts: [] });
    fetch("./last").then(
      response => {
        if (!response.ok) {
          this.setState({ msg: response.statusText });
        } else {
          return response.json()
        }
      })
      .then(result => this.setState({ msg: '', posts: [result] }));
  }

  list() {
    this.setState({ msg: 'loading...', posts: [] });
    fetch("./posts").then(response => response.json())
      .then(result => result.sort((a, b) => b.time - a.time))
      .then(result => this.setState({ msg: '', posts: result }));
  }

  save() {
    this.setState({ msg: 'saving...', posts: [] });
    const image_input =  document.getElementsByClassName('new-image')[0];
    const imagedata = image_input.files[0];
//    const imagedata = document.querySelector('input[type="file"]').files[0];
    const content_input = document.getElementsByClassName('new-content')[0];
    const content = content_input.value;
    const title_input = document.getElementsByClassName('new-title')[0];
    let title = title_input.value;
    if (!title) {
      title = new Date().toLocaleString();
      title = title.split('GMT')[0];
    }
    const sendPost = (title, content, smaller) => {
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      data.append("image", smaller);
      fetch("./posts", {
        method: 'post', body: data
      }).then(res => res.json())
        .then(result => {
          this.setState({ msg: '', posts: [result] });
          title_input.value = '';
          content_input.value = '';
          image_input.value = '';
        });
    }
    if (!imagedata) {
      sendPost(title, content);
    } else {
      const compress = compressor({ maxWidth: 360, maxHeight: 360 });
      compress(imagedata).then(smaller => sendPost(title, content, smaller));
    }

  }

  render() {

    const { msg, posts } = this.state;
    return (
      <div>
        <div className="App-header">
          <h2>允執厥中</h2>
        </div>
        <div>
          <button type="button" onClick={this.last.bind(this)} >LAST</button>
          <button type="button" onClick={this.list.bind(this)} >LIST</button>
        </div>
        <form encType="multipart/form-data" action="">
          <input type="text" className="new-title" />
          <div>
            <input className="new-image" type="file" name="image" />
          </div>
          <div>
            <textarea className="new-content">
            </textarea>
          </div>
          <div> <button type="button" onClick={this.save.bind(this)} >ADD</button></div>
        </form>
        <h3>{msg}</h3>
        {
          posts.map(post =>
            <Post {...post} key={post.id} />)
        }
      </div>
    );
  }
}

export default App;
