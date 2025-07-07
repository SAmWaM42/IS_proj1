import React, { useState } from "react";
import "./Profile.css";

function Profile({ userData }) {
  const { name, email, role, phoneNumber, _id } = userData;

  const [formValues, setFormValues] = useState({
    name: name || "",
    email: email || "",
    role: role || "buyer",
    phoneNumber: phoneNumber || "",
    oldPassword: "",
    newPassword: "",
  });

  const [showSettings, setShowSettings] = useState(false);

  const admin = role === "admin";
  const url = "http://localhost:5000/user/update";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const update = async (e) => {
    let updatedFields = { id: _id };

    if (formValues.name !== name && formValues.name.trim() !== "") {
      updatedFields.name = formValues.name;
    }
    if (formValues.email !== email && formValues.email.trim() !== "") {
      updatedFields.email = formValues.email;
    }
    if (formValues.role !== role) {
      updatedFields.role = formValues.role;
    }
    if (
      formValues.phoneNumber !== phoneNumber &&
      formValues.phoneNumber.trim() !== ""
    ) {
      updatedFields.phoneNumber = formValues.phoneNumber;
    }
    if (formValues.oldPassword && formValues.newPassword) {
      if (formValues.newPassword.trim() !== "") {
        updatedFields.oldPassword = formValues.oldPassword;
        updatedFields.newPassword = formValues.newPassword;
      } else {
        alert("New password cannot be empty.");
        return;
      }
    } else if (formValues.oldPassword || formValues.newPassword) {
      alert("Both old and new password fields are required.");
      return;
    }

    try {
      const result = await fetch(url, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!result.ok) {
        alert("Failed to update profile.");
        return;
      }

      alert("Successfully updated.");
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-top">
        <img src="/default-pfp.jpeg" alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h2>{name}</h2>
          <div className="stats">
            <span><strong>0</strong> Posts</span>
            <span><strong>0</strong> Followers</span>
            <span><strong>0</strong> Following</span>
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Close Settings" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="no-posts">
        <p>No products posted yet.</p>
      </div>

      {showSettings && (
        <div className="form-container">
          <div>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              name="name"
              placeholder={name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber">Phone Number (e.g., 2547******)</label>
            <input
              type="number"
              name="phoneNumber"
              placeholder={phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder={email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="role">Role</label>
            {admin ? (
              <select name="role" value={role} disabled>
                <option value="admin">admin</option>
              </select>
            ) : (
              <select
                name="role"
                value={formValues.role}
                onChange={handleInputChange}
              >
                <option value="buyer">buyer</option>
                <option value="seller">seller</option>
              </select>
            )}
          </div>

          <p>Change Password</p>
          <div>
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              onChange={handleInputChange}
            />
          </div>

          <button type="button" onClick={update}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
