import React, { useState } from 'react';

function Form({ formData, dest_url }) {
  const [formValues, setFormValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted to:', dest_url);
    console.log('Form data:', formValues);
    // Later, add fetch or axios here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form id={dest_url.includes('login') ? 'login-form' : 'register-form'} onSubmit={handleSubmit}>
      {formData.map((field) => (
        <div key={field.key} style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label htmlFor={field.name}>{field.label}</label>

          <div style={{ position: 'relative' }}>
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'password' && showPassword ? 'text' : field.type}
              value={formValues[field.name] || ''}
              onChange={handleChange}
              style={{ width: '100%', paddingRight: field.type === 'password' ? '60px' : '12px' }}
            />

            {field.type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#cc4d3c',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
        </div>
      ))}
    </form>
  );
}

export default Form;

