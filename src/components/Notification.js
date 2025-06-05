// src/components/Notification.js
import React from 'react';

const Notification = ({ onClose }) => {
return (
    <div className="notification-container"> 
    <div className="notification-box"> 
        <span className="notification-text"> 
        ⚠️ Bạn chưa đăng nhập! Vui lòng đăng nhập để đặt câu hỏi.
        </span>
        <button
        onClick={onClose}
        className="close-button" 
        >
        ×
        </button>
    </div>
    </div>
);
};

export default Notification;