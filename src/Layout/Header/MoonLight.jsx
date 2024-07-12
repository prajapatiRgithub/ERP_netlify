import React, { useEffect, useState } from 'react';
import { LI } from '../../AbstractElements';

const MoonLight = () => {
  const [moonlight, setMoonlight] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('layout_version') === 'dark-only') {
      setMoonlight(true);
    }
  }, []);
  /*
  *For changing theme dark & light
  */
  const MoonlightToggle = (light) => {
    if (light) {
      setMoonlight(!light);
      document.body.classList.add('light');
      document.body.classList.remove('dark-only');
      localStorage.setItem('layout_version', 'light');
    } else {
      setMoonlight(!light);
      document.body.classList.add('dark-only');
      document.body.classList.remove('light');
      localStorage.setItem('layout_version', 'dark-only');
    }
  };

  return (
    <LI>
      <div className="mode" onClick={() => MoonlightToggle(moonlight)}>
        <i className={`fa ${moonlight ? 'fa-lightbulb-o' : 'fa-moon-o'}`}></i>
      </div>
    </LI>
  );
};

export default MoonLight;