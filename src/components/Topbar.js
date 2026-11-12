import React from 'react';

const Topbar = () => (
  <header className="topbar">
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">§</span>
      <div>
        <p className="brand-name">Luật Minh Bạch</p>
        <p className="brand-subtitle">Trợ lý tra cứu có dẫn nguồn</p>
      </div>
    </div>
    <span className="scope-badge">BLDS 2015</span>
  </header>
);

export default Topbar;
