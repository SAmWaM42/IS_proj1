import React, { useState, useEffect } from 'react';
import './Form.css';
import Button from '../Button/Button.js';

function Form({ fields, onSubmit })
 {
    const [formData, setFormdata] = useState({});
//switch this to a post to send data to the server
    useEffect(() => {
        fetch('http://localhost:5000/home').then(response => response.json()).then(data => setFormdata(data.message));
    }, []);
    let content = null;
    return (
        <>
            <form onSubmit={onSubmit}>
                {
                fields.map((field) =>
                    (
                        <div key={field.name}>
                            <label for={field.id}>
                                {field.name}
                                </label>
                            {
                                field.type === 'select'?
                                (
                                    content=<select>
                                        {field.value.map((values) => (
                                            <option key={field.name} value={values.value}>
                                                {values.value}
                                            </option>
                                        ))}
                                        

                                          </select>

                                )//add any other field types here
                                : 
                                (

                                     content= 
                                     <input type={field.type}
                                     id={field.name}
                                     name={field.name}
                                     value={formData[field.name] || ''}
                                     onChange={(e) => setFormdata({ ...formData, [field.name]: e.target.value }) }
                                     />
                                )
                               
                                     
                            }
    
                          {content}
                        
                        </div>

                    ))


                }
                <div className="button-container">
                    <Button type="submit" design="submit-button" />
                </div>

            </form>
        </>
    );
}
export default Form;  
