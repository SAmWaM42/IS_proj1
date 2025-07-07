import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { GlobalContext } from './ContextWrapper.js';

function Form({ formData, button_data, id, dest_url }) {
  const contextData = useContext(GlobalContext);
  const { myData, loggedIn, handleUpdate } = contextData || {};

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(() => {
    const initialValues = {};
    formData.forEach(field => {
      initialValues[field.name] = '';
    });
    return initialValues;
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const url = `http://localhost:5000/${dest_url}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const SentData = new FormData();

    for (const key in formValues) {
      SentData.append(key, formValues[key]);
    }

    if (selectedFile) {
      SentData.append("image", selectedFile);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: SentData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.redirect) {
          if (data.redirect === "/Dashboard" && handleUpdate) {
            handleUpdate({ myData: data.myData, loggedIn: true });
          }
          navigate(data.redirect);
        }
        alert(data.message || 'Success!');
      } else {
        alert(data.message || 'Failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form onSubmit={handleSubmit} id={id || ''} className="form-container">
      {formData.map((field) => (
        <div className="form-group" key={field.key}>
          <label htmlFor={field.name}>{field.label}</label>
          <div className="input-wrapper">
            {field.type === 'file' ? (
              <input
                type="file"
                name={field.name}
                accept={field.accept || '*/*'}
                onChange={handleFileChange}
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={formValues[field.name]}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select...</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.value}</option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type={field.type === 'password' && showPassword ? 'text' : field.type}
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={formValues[field.name]}
                  onChange={handleInputChange}
                />
                {field.type === 'password' && (
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {button_data && (
        <Button
          className={button_data.className}
          type={button_data.type}
          label={button_data.label}
        />
      )}
    </form>
  );
}

export default Form;

