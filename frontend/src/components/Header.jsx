import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHospital, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from "../assets/logo.svg";

const HeaderWrapper = styled.header`
  background: linear-gradient(90deg, #4CAF50, #45a049);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  
  &:hover {
    color: #e0f7fa;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo to="/">
          <LogoImage src={logo} alt="MedAid Logo" />
          <span>MedAid</span>
        </Logo>
        
        <Nav>
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to="/consultation">Consultation</NavLink>}
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        </Nav>
        
        <UserActions>
          {user ? (
            <>
              <NavLink to="/dashboard">
                <FaUser /> {user.name}
              </NavLink>
              <UserButton onClick={logout}>
                <FaSignOutAlt /> Logout
              </UserButton>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </UserActions>
      </HeaderContent>
    </HeaderWrapper>
  );
};

export default Header;