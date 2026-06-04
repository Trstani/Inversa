import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  apiClient,
  setAuthToken,
  clearAuthToken,
} from '../api/client';

const AuthContext =
  createContext();

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  =========================
  RESTORE LOGIN
  =========================
  */

  useEffect(() => {

    const initializeAuth =
      async () => {

        try {

          const token =
            localStorage.getItem(
              'authToken'
            );

          if (!token) {
            setIsLoading(false);
            return;
          }

          /*
          =========================
          DECODE JWT
          =========================
          */

          const payload =
            JSON.parse(
              atob(
                token.split('.')[1]
              )
            );

          if (
            payload.exp * 1000 <
            Date.now()
          ) {

            clearAuthToken();

            setUser(null);

            setIsLoading(false);

            return;

          }

            setUser({
                id: payload.id,
                name: payload.name,
                email: payload.email,
                role: payload.role,
            });

        } catch (error) {

          console.error(
            'Failed restoring auth:',
            error
          );

          clearAuthToken();

          setUser(null);

        } finally {

          setIsLoading(false);
        }
      };

    initializeAuth();

  }, []);

  /*
  =========================
  LOGIN
  =========================
  */

  const login = async (
    email,
    password
  ) => {

    try {

      setIsLoading(true);

      const response =
        await apiClient.auth.login({
          email,
          password,
        });

      if (response.success) {

        const {
          user,
          token,
        } = response.data;

        setUser(user);

        setAuthToken(token);

        return {
          success: true,
        };
      }

      return {
        success: false,
        error: response.message,
      };

    } catch (error) {

      return {
        success: false,
        error: error.message,
      };

    } finally {

      setIsLoading(false);
    }
  };

  /*
  =========================
  REGISTER
  =========================
  */

  const register = async (
    userData
  ) => {

    try {

      setIsLoading(true);

      setError(null);

      const response =
        await apiClient.auth.register({
          name: userData.name,
          email: userData.email,
          password:
            userData.password,
        });

      if (response.success) {

        return {
          success: true,
          userId:
            response.data.userId,
          email:
            userData.email,
        };

      }

      return {
        success: false,
        error: response.message,
      };

    } catch (error) {

      const errorMsg =
        error.message ||
        'Registration failed';

      setError(errorMsg);

      return {
        success: false,
        error: errorMsg,
      };

    } finally {

      setIsLoading(false);
    }
  };

  /*
  =========================
  LOGOUT
  =========================
  */

  const logout = () => {

    setUser(null);

    clearAuthToken();

    setError(null);
  };

  /*
  =========================
  UPDATE USER
  =========================
  */

  const updateUser = (
    updatedUserData
  ) => {

    setUser(updatedUserData);
  };

  /*
  =========================
  STATES
  =========================
  */

  const isAuthenticated =
    !!user;

  const isAdmin =
    user?.role === 'admin';

  const isGuest =
    !user;

  /*
  =========================
  PROVIDER
  =========================
  */

  return (

    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isGuest,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};