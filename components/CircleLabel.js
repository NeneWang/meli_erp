import React from 'react';

const CircleLabel = ({ label, color, is=null }) => {

  return (
    
      <span className="labelStyles">
        {is==null && <span className="labelInside">{label}.</span>}
        {is=='cross' && <span className="labelInside">✕</span>}
        {is=='check' && <span className="labelInside">✓</span>}
      </span>
    
  );
};

export default CircleLabel;