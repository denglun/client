import React, { Component } from 'react';

class Import extends Component {

  constructor(props) {
    super(props);
    this.state = { msg: '' };
  }

  imprt() {
    this.setState({ msg: 'importing...', posts: [] });
    const import_posts = document.getElementsByClassName('import-posts')[0];
    const importdata = import_posts.files[0];
    if (!importdata) {
      return false;
    }
    const data = new FormData();
    data.append("posts", importdata);
    fetch("./import", {
      method: 'post', body: data
    }).then(res => res.json())
      .then(([...result]) => {
        this.setState({ msg: result});
        import_posts.value = '';
      });
  }

  render() {
    function cancel() {
      document.getElementById("importForm").style.display = 'none';
      document.getElementById("postForm").style.display = 'block';
    }

    return <div className="table" id="importForm">
      <h3>{this.state.msg}</h3>
      <form encType="multipart/form-data" action="">
        <div className="input">
          <input className="import-posts" type="file" name="posts" />
        </div>
        <div>
          <button type="button" onClick={this.imprt.bind(this)} >IMPORT</button>
          <button type="button" onClick={cancel.bind(this)} >CANCEL</button>
        </div>
      </form>
    </div>;
  }
}

export default Import;