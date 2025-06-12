import { Navigate, NavigationType } from "react-router-dom";
import Button from "./Button";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Form({formData,button_data,dest_url})
{
const navigate = useNavigate();
    const [formValues, setFormValues] = useState(() => {
        const initialValues = {};
        formData.forEach(field => {
            initialValues[field.name] = ''; // Initialize each field to empty string
        });
        return initialValues;
    });
    const url=`http://localhost:5000/${dest_url}`;
    var  method;
    console.log(url);

 method ='POST';
    
    console.log(method);	
 
     const handleSubmit = async (event) => {
        event.preventDefault(); // <-- THIS IS THE CRUCIAL LINE: Prevent default browser form submission!

        console.log("Submitting data:", formValues);
        console.log("--- handleSubmit TRIGGERED! ---"); 
        

        try {
            const response = await fetch(url, {
                method: method, // Use the determined method
                headers: {
                    'Content-Type': 'application/json', // Tell the server we're sending JSON
                },
                body: JSON.stringify(formValues), // Send your state data as JSON
            });

            const data = await response.json(); // Parse the server's JSON response

            if (response.ok) {
                console.log('Server response (success):', data);
                if(data.redirect) {

           navigate(data.redirect);
        }
                alert(data.message || 'Operation successful!');
                // You might want to redirect, show success message, clear form, etc.
            } else {
                console.error('Server response (error):', data);
                alert(data.message || 'Operation failed.');
            }
            
        } catch (error) {
            console.error('Network or client-side error:', error);
            alert('A network error occurred. Please try again.');
        }
      

    };
      const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
    }))};
   
    return(
        <form onSubmit={handleSubmit} className="form-container">
            {
            formData.map((field) => (
                <div key={field.key}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name}  value={formValues[field.name]} onChange={handleInputChange}/>
                </div>
            ))}
           <Button
            className={button_data.className}
             type={button_data.type} label={button_data.label} 
              />
        </form> 

    )

}

export default Form;