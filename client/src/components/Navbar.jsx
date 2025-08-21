import React from "react";
import "./Navbar.css";

export default function Navbar({ title, username }) {
  return (
    <div className="navbar">
      <div className="navbar-title">{title}</div>
      <div className="navbar-username">{username}</div>
    </div>
  );
}
