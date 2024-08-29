import './Erice.css';
import React, { useState } from 'react';
import axios from 'axios';

function Erice() {
  const [content, setContent] = useState("");
  const [responseData, setResponseData] = useState("");

  const [content1, setContent1] = useState("");
  const [responseData1, setResponseData1] = useState("");

  const [content2, setContent2] = useState("");
  const [responseData2, setResponseData2] = useState("");

  const QuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://182.18.139.138:9001/api/student-service/user/ask',
        [
          {
            role: 'user',
            content: content,
          }
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      const points = data.split('fromGPT :').slice(1);
      setResponseData(points);
    } catch (error) {
      console.log(error);
    }
  };

  const QusSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://182.18.139.138:9001/api/student-service/user/seekthesolution',
        [
          {
            role: 'user',
            content: content1,
          }
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      const points1 = data.split('fromGPT:').slice(1);
      setResponseData1(points1);
    } catch (error) {
      console.log(error);
    }
  };

  const EndSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://182.18.139.138:9001/api/student-service/user/Endtoend',
        [
          {
            role: 'user',
            content: content2,
          }
        ],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      const points2 = data.split('fromGPT:').slice(1);
      setResponseData2(points2);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="erice-container">
      <h1 className="title">AskOxy</h1>

      <div className="form-container">
        {/* Form and display for the first API call */}
        <form onSubmit={QuerySubmit} className="query-form">
          <input
            className="input-field"
            placeholder="Ask a query"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
        
        {responseData.length > 0 && (
          <div className="response-container">
            <h2 className="response-title">Responses from Query API:</h2>
            <ul className="response-list">
              {responseData.map((point, index) => (
                <li key={index} className="response-item">{point.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="form-container">
        <form onSubmit={QusSubmit} className="end-form">
          <input
            className="input-field"
            placeholder="Get solution"
            value={content1}
            onChange={(e) => setContent1(e.target.value)}
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>

        {responseData1.length > 0 && (
          <div className="response-container">
            <h2 className="response-title">Responses from Q & A API:</h2>
            <ul className="response-list">
              {responseData1.map((point, index) => (
                <li key={index} className="response-item">{point.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div> 
      
      <div className="form-container">
        {/* Form and display for the third API call */}
        <form onSubmit={EndSubmit} className="query-form">
          <input
            className="input-field"
            placeholder="You can know any End - End Process"
            value={content2}
            onChange={(e) => setContent2(e.target.value)}
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
        
        {responseData2.length > 0 && (
          <div className="response-container">
            <h2 className="response-title">Responses from End-End API:</h2>
            <ul className="response-list">
              {responseData2.map((point, index) => (
                <li key={index} className="response-item">{point.trim()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Erice;



  //   <div className="main-container">
  //   <div className="side-panel">
  //     <div className="image-grid">
  //       <div className="image-row">
  //         <img src="image1.jpg" alt="Image 1" />
  //         <img src="image2.jpg" alt="Image 2" />
  //         <img src="image3.jpg" alt="Image 3" />
  //       </div>
  //       <div className="image-row">
  //         <img src="image1.jpg" alt="Image 1" />
  //         <img src="image2.jpg" alt="Image 2" />
  //         <img src="image3.jpg" alt="Image 3" />
  //       </div>
  //       <div className="image-row">
  //         <img src="image1.jpg" alt="Image 1" />
  //         <img src="image2.jpg" alt="Image 2" />
  //         <img src="image3.jpg" alt="Image 3" />
  //       </div>
  //       <div className="image-row">
  //         <img src="image1.jpg" alt="Image 1" />
  //         <img src="image2.jpg" alt="Image 2" />
  //         <img src="image3.jpg" alt="Image 3" />
  //       </div>
  //     </div>
  //   </div>
  //   <div className="content-panel">
 
  //     <div className="controls-section">
  //       <div className="button-group">
  //         <button>Button 1</button>
  //         <button>Button 2</button>
  //         <button>Button 3</button>
  //         <button>Button 4</button>
  //       </div>
  //       <div className="input-container">
  //         <input type="text" placeholder="Type your message..." />
  //       </div>
  //     </div>
  //     <div className="history-section">
    
  //     </div>
  //   </div>
  // </div>