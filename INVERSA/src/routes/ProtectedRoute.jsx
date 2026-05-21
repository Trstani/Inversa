import React from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}) => {

  const {
    isAuthenticated,
    isAdmin,
    isLoading,
  } = useAuth();

  /*
  =========================
  WAIT AUTH RESTORE
  =========================
  */

  if (isLoading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /*
  =========================
  NOT LOGGED IN
  =========================
  */

  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
  =========================
  ADMIN ONLY
  =========================
  */

  if (
    adminOnly &&
    !isAdmin
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
  =========================
  ALLOW ACCESS
  =========================
  */

  return children;
};

export default ProtectedRoute;