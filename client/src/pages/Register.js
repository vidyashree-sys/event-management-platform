// client/src/pages/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const defaultAdminEmail = "admin@example.com";
 const handleRegister = async e => {
  e.preventDefault();
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    const assignedRole = email === defaultAdminEmail ? "admin" : role;
    
    await setDoc(doc(firestore, "users", cred.user.uid), { role: assignedRole });
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required className="w-full border p-2 mb-4 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required className="w-full border p-2 mb-4 rounded"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="viewer">Viewer</option>
          <option value="clubMember">Club Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
