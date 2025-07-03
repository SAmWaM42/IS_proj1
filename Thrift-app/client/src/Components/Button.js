import React from 'react';
import './Button.css';

function Button({ className, type, label, onClick, form }) {
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      form={form}
    >
      {label}
    </button>
  );
}

export default Button;

