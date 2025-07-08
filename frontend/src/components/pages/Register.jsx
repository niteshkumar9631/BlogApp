import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const { mode, isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const changeAvatarHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Form Validation
    if (!name || !email || !phone || !password || !role || !education || !avatar) {
      return toast.error("All fields including avatar are required.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("education", education);
    formData.append("role", role);
    formData.append("avatar", avatar);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setEducation("");
      setAvatar(null);
      setAvatarPreview("");

      toast.success(data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <section className="auth-form">
        <form onSubmit={handleRegister}>
          <h1>REGISTER</h1>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">SELECT ROLE</option>
            <option value="Reader">READER</option>
            <option value="Author">AUTHOR</option>
          </select>

          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <select value={education} onChange={(e) => setEducation(e.target.value)}>
            <option value="">SELECT YOUR EDUCATION</option>
            <option value="Matric">Matric</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Graduation">Graduation</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div className="avatar">
              <img
                src={avatarPreview ? avatarPreview : "/pic.jpg"}
                alt="avatar"
              />
            </div>
            <input
              type="file"
              onChange={changeAvatarHandler}
              className="avatar_input_tag"
              style={{ border: "none" }}
              accept="image/*"
            />
          </div>

          <p>
            Already Registered? <Link to="/login">Login Now</Link>
          </p>

          <button className="submit-btn" type="submit">
            REGISTER
          </button>
        </form>
      </section>
    </article>
  );
};

export default Register;
