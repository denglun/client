import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import download from 'downloadjs';
import Cryptr from 'cryptr';

import './App.css';
import compressor from './compressor';
import Post from './Post';
import Form from './Form';
import Import from './Import';

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

  showImport() {
    if (!document.getElementById("importForm")) {
      ReactDOM.render(
        <Import />,
        document.getElementById('importDiv')
      );
    }else{
      document.getElementById("importForm").style.display = 'block';
    }
    document.getElementById("postForm").style.display = 'none';
  }

  render() {

    const { msg, posts } = this.state;
    return (
      <div className="table">
        <div>
          <label className="toggle" htmlFor="toggle">&#9776; <span>Menu</span></label>
          <input className="toggle" id="toggle" type="checkbox" />
          <nav>
            <ul>
              <li><a href="#" onClick={this.last.bind(this)} >LAST</a></li>
              <li><a href="#" onClick={this.list.bind(this)} >LIST</a></li>
              <li><a href="#" onClick={this.export.bind(this)}>EXPORT</a></li>
              <li><a href="#" onClick={this.showImport.bind(this)}>IMPORT</a></li>
            </ul>
          </nav>
        </div>
        <div className="App-header">
          <h2>允執厥中</h2>
        </div>

        <h3>{msg}</h3>
        <div id="importDiv" ></div>
        <Form add={this.save.bind(this)} />

        {
          posts.map(post =>
            <Post {...post} key={post.id} />)
        }
      </div>
    );
  }
}

export default App;
