
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Profile.css'




function Profile({ userData }) {
    const { name, email, role, phoneNumber, _id } = userData;
    const [formValues, setFormValues] = useState({
        name: name || '', // Use || '' to prevent uncontrolled input warning if initial data is null/undefined
        email: email || '',
        role: role || 'buyer', // Provide a default role if none
        phoneNumber: phoneNumber || '',
        oldPassword: '', // These should always start empty
        newPassword: ''
    });

    const admin=(role==="admin");
    console.log(admin);
    const url = "http://localhost:5000/user/update"
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input changed: Name=${name}, Value=${value}`);
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value,
        }))
    };


    const update = async (e) => {
        let  updatedFields=
        {     id: _id,
        }
        if (formValues.name !== name && formValues.name.trim() !== '') {
            updatedFields.name = formValues.name;
        }
        if (formValues.email !== email && formValues.email.trim() !== '') {
            updatedFields.email = formValues.email;
        }
        if (formValues.role !== role) { // Role might not have a .trim() if it's a select
            updatedFields.role = formValues.role;
        }
        if (formValues.phoneNumber !== phoneNumber && formValues.phoneNumber.trim() !== '') {
            updatedFields.phoneNumber = formValues.phoneNumber;
        }
          if (formValues.oldPassword && formValues.newPassword) {
            // Basic validation: ensure new password is not empty after trim
            if (formValues.newPassword.trim() !== '') {
                updatedFields.oldPassword = formValues.oldPassword;
                updatedFields.newPassword = formValues.newPassword;
            } else {
                alert("New password cannot be empty if you're changing it.");
                return; 
            }
        } else if (formValues.oldPassword || formValues.newPassword) {
         
            alert("Both old and new password fields are required to change your password.");
            return;
        }

    console.log("Client-side: updatedFields object BEFORE stringify:", updatedFields);
    console.log("Client-side: JSON.stringify(updatedFields):", JSON.stringify(updatedFields));
    console.log("Client-side: Sending to URL:");

        try {
          
            const result = await fetch(url, {
                credentials: "include",
                method: 'POST',
                headers:{
                     'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedFields)
            })
            if (!result.ok) {
                console.log("not successfully updated");
            }


            alert("successfully updated");

        }
        catch (error) {
            console.error("error updating user", error);

        }

    }

    return(
        <div>
            <div>
                   <label for='name'>username</label>
                <input type='text' name='name' placeholder={name} onChange={handleInputChange}></input>
            </div>
             <div>
                   <label for='number'>phoneNumber e.g 2547******</label>
                <input type='number' name='phoneNumber' placeholder={phoneNumber} onChange={handleInputChange}></input>
            </div>
            <div>
                  <label for='email'>email</label>
                <input type='email' name='email' placeholder={email} onChange={handleInputChange}></input>
            </div><div>
                  <label for='role'>role</label>
                  {
              admin?(
                 <select name='role' value={role} onChange={handleInputChange} disabled>
                    <option type='text' name='' value='admin'>admin</option>
                
                </select>

                
               ):
                (
                     <select name='role' value={role} onChange={handleInputChange}>
                    <option type='text' name='name' value='buyer'>buyer</option>
                    <option type='text' name='name' value='seller'>seller</option>
                </select>
                )
}
                 </div>
            <div>
                <p>To change password</p>
                <div>
                    <label for='oldPassword'>oldPassword</label>
                    <input type='password' name='oldPassword' id='oldPassword' onChange={handleInputChange}></input>
                </div>
                <div>
                    <label for='oldPassword'>newPassword</label>
                    <input type='password' name='newPassword' id='newPassword' onChange={handleInputChange}></input>
                </div>
            </div>
            <button type="button" onClick={update} >Change details</button>

</div>



    )





}

export default Profile;

