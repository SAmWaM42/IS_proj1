import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ formData, dest_url }) {
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
        if (data.redirect) navigate(data.redirect);
        alert(data.message || 'Operation successful!');
      } else {
        alert(data.message || 'Operation failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error, try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id={dest_url.includes('login') ? 'login-form' : 'register-form'}
      className="form-container"
    >
      {formData.map((field) =>
        field.type === 'file' ? (
          <div key={field.key}>
            <label>{field.label}</label>
            <input
              type="file"
              name={field.name}
              accept={field.accept || '*/*'}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div key={field.key}>
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formValues[field.name]}
              onChange={handleInputChange}
            />
          </div>
        )
      )}
    </form>
  );
}

export default Form;
