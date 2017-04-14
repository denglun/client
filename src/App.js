import React, { Component } from 'react';
import './App.css';
import compressor from './compressor';
import Post from './Post';
import download from 'downloadjs';
import Cryptr from 'cryptr';

const cryptr = new Cryptr('my secret key');
const IMAGE_CONFIG = { maxWidth: 360, maxHeight: 360 };

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

  export() {
    this.setState({ msg: 'exporting...', posts: [] });
    fetch("./posts").then(response => response.json())
      .then(result => result.sort((a, b) => b.time - a.time))
      .then(result => {
        download(JSON.stringify(result), "BLOGS.json", "text/json");
        this.setState({ msg: 'Done!' });
      });
  }

  save() {
    this.setState({ msg: 'saving...', posts: [] });
    const image_input = document.getElementsByClassName('new-image')[0];
    const imagedata = image_input.files[0];
    const content_input = document.getElementsByClassName('new-content')[0];
    const content = content_input.value;
    const title_input = document.getElementsByClassName('new-title')[0];
    let title = title_input.value;
    if (!title) {
      title = new Date().toLocaleString();
      title = title.split('GMT')[0];
    }
    const sendPost = (title, content, image) => {
      const data = new FormData();
      data.append("title", title);
      data.append("content", cryptr.encrypt(content));
      if (image) {
        data.append("hasImage", true);
        data.append("image", image);
      } else {
        data.append("hasImage", false);
      }
      fetch("./posts", {
        method: 'post', body: data
      }).then(res => res.json())
        .then(result => {
          this.setState({ msg: '', posts: [result] });
          title_input.value = '';
          content_input.value = '';
          image_input.value = '';
        });
    };

    if (!imagedata) {
      sendPost(title, content);
    } else {
      compressor(IMAGE_CONFIG)(imagedata).then(
        smaller => sendPost(title, content, smaller)
      );
    }
  }

  render() {

    const { msg, posts } = this.state;
    return (
      <div>
        <div className="App-header">
          <h2>允執厥中</h2>
        </div>
        <div className="buttons">
          <button type="button" onClick={this.last.bind(this)} >LAST</button>
          <button type="button" onClick={this.list.bind(this)} >LIST</button>
          <a href="#" onClick={this.export.bind(this)} className="float-right">EXPORT</a>
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
