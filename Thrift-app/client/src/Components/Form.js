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
  const url = `http://localhost:5000/${dest_url}`;
  const method = 'POST';

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
        method,
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
        alert(data.message || 'Operation successful!');
      } else {
        alert(data.message || 'Operation failed.');
      }
    } catch (error) {
      console.error('Network or client-side error:', error);
      alert('A network error occurred. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  return (
    <form onSubmit={handleSubmit} id={id || ''} className="form-container">
      {formData.map((field) => {
        if (field.type === 'file') {
          return (
            <div key={field.key}>
              <label>{field.label}</label>
              <input
                type="file"
                name={field.name}
                accept={field.accept || '*/*'}
                onChange={handleFileChange}
              />
            </div>
          );
        } else if (field.type === 'select') {
          return (
            <div key={field.key}>
              <label>{field.label}</label>
              <select name={field.name} value={formValues[field.name]} onChange={handleInputChange}>
                <option value='' disabled>Select an option</option>
                {field.options.map(option => (
                  <option key={option.value} value={option.value}>{option.value}</option>
                ))}
              </select>
            </div>
          );
        } else {
          return (
            <div key={field.key}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formValues[field.name]}
                onChange={handleInputChange}
              />
            </div>
          );
        }
      })}
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

