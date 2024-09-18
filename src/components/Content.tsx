import React from 'react';
import './content.css'; // Import the CSS

const Content: React.FC = () => {
  return (
    <div className="card">
      <h1>
        Coding is
        {/* Scroller Start */}
        <div className="scroller">
          <span>
            Cool gksdgdfsg rgsrg<br />
            Art rdnmsfjsafmn<br />
            Intriguing sfkjaejkf erkwejkfw jkfwfkjweaf<br />
            Challenging  sadfkdkjf qwlekqwklf flkwfkjwejkf
          </span>
        </div>
        {/* Scroller End */}
      </h1>

    </div>
  );
};

export default Content;
