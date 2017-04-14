import React, { Component } from 'react';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('my secret key');

export default class Post extends Component {
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
        const img = document.getElementById(id).getElementsByClassName("imageHolder")[0];
        img.style.display = 'none';
    }
    render() {
        const { id, title, time, content, hasImage } = this.props;
        const { msg } = this.state;
        if (msg) {
            return <div> {msg}
                <hr /></div>;
        }
        let dcnt = '(no content)';
        if (content) {
            try {
                dcnt = cryptr.decrypt(content);
            } catch (e) {
                dcnt = content;
                console.log(e);
            }
        }
        return (<div className="post" id={id}>
            <h3 className="title">{title}</h3>
            <div className="post-time">{new Date(time).toLocaleString().split('GMT')[0]}</div>
            {
                hasImage ?
                    <div>
                        <div className="imageHolder">loading image...</div>
                        <img src={"./posts/" + id + "/image"} alt=":)" onLoad={this.removeImg.bind(this, [id])} />
                    </div>
                    :
                    null
            }
            <div className="content">{dcnt}</div>
            <button type="button" onClick={this.remove.bind(this, [id])} >DELELE</button>
            <hr />
        </div>);
    };

}