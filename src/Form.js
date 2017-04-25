import React from 'react';

const Form = ({add}) =>
        <div id="postForm" className="table">
          <form encType="multipart/form-data" action="">
            <div className="input">
              <input type="text" className="new-title" />
            </div>
            <div className="input">
              <input className="new-image" type="file" name="image" />
            </div>
            <div>
              <textarea className="new-content">
              </textarea>
            </div>
            <div>
              <button type="button" onClick={add} >ADD</button>
            </div>
          </form>
        </div>

export default Form;