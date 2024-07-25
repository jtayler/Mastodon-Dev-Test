import React from 'react';

const TextInput = ({ value, onChange, placeholder, disabled, ...props }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    {...props}
  />
);

export default TextInput;