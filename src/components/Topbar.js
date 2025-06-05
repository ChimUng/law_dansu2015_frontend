// src/components/Topbar.js
import React, { useState } from 'react';

const Topbar = ({ session, onLogout, onLogin }) => {
const [open, setOpen] = useState(false);

return (
    <div className="topbar"> 
    <div className="topbar-title"> 
        gemini-flash-api
    </div>

    <div className="topbar-auth"> 
        {session ? (
        <>
            <img
            src={session.user.user_metadata.avatar_url || '/logo192.png'} // Fallback avatar
            alt="avatar"
            className="avatar" 
            onClick={() => setOpen(!open)}
            />
            {/* Hiển thị dropdown menu nếu open là true */}
            {open && (
            <div className="dropdown-menu">
                <button
                onClick={() => {
                    onLogout();
                    setOpen(false); // Đóng dropdown sau khi đăng xuất
                }}
                className="dropdown-button" 
                >
                Đăng xuất
                </button>
            </div>
            )}
        </>
        ) : (
        <div className="auth-buttons"> 
            <button
            onClick={onLogin}
            className="login-button" 
            >
            Đăng nhập
            </button>
            <button
            onClick={onLogin} // Thường nút đăng ký cũng dẫn đến trang/flow đăng nhập
            className="signup-button" 
            >
            Đăng ký
            </button>
        </div>
        )}
    </div>
    </div>
);
};

export default Topbar;