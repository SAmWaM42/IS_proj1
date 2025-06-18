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
         const SentData=new FormData();
        event.preventDefault(); // <-- THIS IS THE CRUCIAL LINE: Prevent default browser form submission!

        
        console.log("--- handleSubmit TRIGGERED! ---"); 
      
    
        for( const key in formValues) {
            SentData.append(key, formValues[key]); // Append each field to the FormData object
        }
        if(selectedFile)
        {
            SentData.append("image",selectedFile);
        }
        
      console.log("Submitting data:", SentData);
        try {
            const response = await fetch(url, {
                method: method, // Use the determined method
                
                body: SentData, // Send your state data as JSON
                credentials: 'include', // Include cookies for session management
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
    const [selectedFile, setSelectedFile] = useState(null);

const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
    } else {
        setSelectedFile(null);
    }
};
   
    return(
        <form onSubmit={handleSubmit} className="form-container">
            {
            formData.map((field) => (
                
               field.type==='file'?
               (
                <div key={field.key}>
                    <label>{field.label}</label>
                     <input
                            type="file"
                            name={field.name}
                            accept={field.accept || '*/*'} // Use field.accept if provided, else any file
                            onChange={handleFileChange} // <--- Use the file handler
                        />
                </div>
               )
               :
               (
                <div key={field.key}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name}  value={formValues[field.name]} onChange={handleInputChange}/>
                </div>
               )
              
            ))}
           <Button
            className={button_data.className}
             type={button_data.type} label={button_data.label} 
              />
        </form> 

    )

}

export default Form;
