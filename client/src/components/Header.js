import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Header({ role }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Campus Events</h1>
      {user && (
        <div className="flex gap-4 items-center">
          <span>Hello{role ? `, ${role}` : ""}!</span>
          <button
            onClick={async () => {
              await logout();
              window.location.href = "/";
            }}
            className="underline"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
