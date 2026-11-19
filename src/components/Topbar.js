import React from 'react';

const Topbar = ({ chatTitle }) => (
  <header className="topbar">
    <div><p className="workspace-title">{chatTitle || 'Cuộc trò chuyện mới'}</p><p className="workspace-subtitle">Trợ lý tra cứu có dẫn nguồn</p></div>
    <span className="scope-badge">BLDS 2015</span>
  </header>
);

export default Topbar;
