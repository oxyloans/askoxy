// Loading.tsx
import React from 'react';
import './Loading.css'; // Ensure this path matches where your CSS is located

const Example: React.FC<{ variant: string }> = ({ variant }) => {
  return (
    <div className={`loading ${variant}`}>
      <span>L</span>
      <span>O</span>
      <span>A</span>
      <span>D</span>
      <span>I</span>
      <span>N</span>
      <span>G</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};

export default Example;
