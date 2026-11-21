import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: Record<UserRole, User> = {
  insurance_officer: {
    id: "11111111-1111-1111-1111-111111111111",
    email: "officer.sharma@agriverify.in",
    full_name: "R. K. Sharma",
    role: "insurance_officer",
    designation: "Senior Claims Assessor (Bhopal Div.)",
    phone: "+91 98260 11223"
  },
  farmer: {
    id: "22222222-2222-2222-2222-222222222222",
    email: "farmer.rajesh@agriverify.in",
    full_name: "Rajesh Kumar Patel",
    role: "farmer",
    designation: "Farmer & Landholder (Bhopal)",
    phone: "+91 94250 88776"
  },
  admin: {
    id: "99999999-9999-9999-9999-999999999999",
    email: "admin@agriverify.in",
    full_name: "System Administrator",
    role: "admin",
    designation: "AgriVerify Operations",
    phone: "+91 99999 00000"
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to insurance_officer for reviewing the core workspaces
  const [user, setUser] = useState<User | null>(DEMO_USERS.insurance_officer);

  const loginAs = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'farmer',
        loginAs,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
