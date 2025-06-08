import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import logo from './assets/logo.png';
import userIcon from './assets/user.png';
import logoutIcon from './assets/logout.png';
import { jwtDecode } from 'jwt-decode';  // fixed import (default import)

function App() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <GoogleOAuthProvider clientId="977589759806-m0r2757kf19l372i5p21s1or1emvgbh9.apps.googleusercontent.com">
      <div
        style={{
          position: 'relative',
    width: '100%',
    maxWidth: '1280px',
    padding: '1rem',
    margin: '0 auto',
    boxSizing: 'border-box',
    minHeight: '100vh',
    backgroundColor: 'var(--background-color, #242424)',
    color: 'var(--text-color, rgba(255,255,255,0.87))',

        }}
      >
        {/* Logo fixed at top left */}
        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem' }}>
          <img
            src={logo}
            alt="CloudDoc Logo"
            style={{ width: '250px', height: 'auto' }}
          />
        </div>

        {/* Login / Logout fixed at top right */}
        <div
          style={{
            position: 'absolute',
            top: '0.8rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 1000,
          }}
        >
          {!token ? (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const idToken = credentialResponse.credential;
                const decoded = jwtDecode(idToken);
                setToken(idToken);
                setUserInfo(decoded);
                console.log('Logged in. User info:', decoded);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              scope="openid email profile"
            />
          ) : (
            <>
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light semi-transparent for light mode
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(4px)', // subtle frosted glass effect
    border: '1px solid rgba(0,0,0,0.1)',
  }}
>
  <img
    src={userInfo?.picture || userIcon}
    alt="User"
    style={{
      width: '26px',
      height: '26px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '1px solid #ccc',
    }}
  />
  <p
    style={{
      fontSize: '1rem',
      color: 'inherit', // inherits from parent theme
      margin: 0,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
  >
    {userInfo?.name || 'USER'}
  </p>
</div>


              <button
                onClick={() => {
                  setToken(null);
                  setUserInfo(null);
                }}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 0 6px rgba(255, 77, 79, 0.6)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d93638';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(217, 54, 56, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff4d4f';
                  e.currentTarget.style.boxShadow = '0 0 6px rgba(255, 77, 79, 0.6)';
                }}
              >
                <img
                  src={logoutIcon}
                  alt="Logout"
                  style={{ width: '18px', height: '18px' }}
                />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Header Section */}
        <div style={{ textAlign: 'center', paddingTop: '0.2rem' }}>
          {token ? (
            <h1
              style={{
                fontSize: '3.5rem',
                margin: '0 0 -0.2rem 0',
              }}
            >
              <span style={{ color: '#038ee3' }}>Cloud</span>Doc
            </h1>
          ) : (
            <>
              <h1
                style={{
                  fontSize: '3.5rem',
                  color: '#000',
                  margin: '0 0 -0.2rem 0',
                }}
              >
                CloudDoc
              </h1>
              <p style={{ fontSize: '2rem', color: 'gray', margin: '0 1rem' }}>
                Smart & Secure File Storage
              </p>
            </>
          )}
        </div>

        {/* Main content: only when logged in */}
        {token && (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'var(--background-color, #242424)',
              color: 'var(--text-color, rgba(255,255,255,0.87))',
            }}
          >
            <FileUpload token={token} onUploadSuccess={handleUploadSuccess} />
            <hr style={{ margin: '2rem 0' }} />
            <FileList token={token} refreshKey={refreshKey} username={userInfo?.name} />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
