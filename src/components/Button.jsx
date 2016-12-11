import React from 'react';

const Button = ({ children, icon, func, disabled, btnClass }) =>
  <span>
    <button className={`button ${btnClass}`} onClick={func} disabled={disabled}>
      <span className="icon">
        <i className={`fa fa-${icon}`} />
      </span>
      {children && <span>{children}</span>}
    </button>
    &nbsp;
  </span>
;

export default Button;
