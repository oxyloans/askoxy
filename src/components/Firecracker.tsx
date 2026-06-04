import React, { useEffect, useRef } from 'react';

// Firecracker Component
const Firecracker: React.FC = () => {
  const firecrackerRef = useRef<HTMLDivElement>(null);
  const bits = 80;
  const speed = 33;
  const bangs = 5;
  let swide = 800;
  let shigh = 600;


  const colours: string[] = ["#03f", "#f03", "#0e0", "#93f", "#0cf", "#f93", "#f0c"];
const bangheight: { [key: string]: number } = {};
const intensity: { [key: string]: number } = {};
const colour: { [key: string]: number } = {};
const Xpos: { [key: string]: number } = {};
const Ypos: { [key: string]: number } = {};
const dX: { [key: string]: number } = {};
const dY: { [key: string]: number } = {};
const stars: { [key: string]: HTMLDivElement } = {};
const decay: { [key: string]: number } = {};


  // Set dimensions on resize
  const set_width = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    swide = width > 0 ? width : 800;
    shigh = height > 0 ? height : 600;
  };

  // Create star/rocket elements
  const createDiv = (content: string, fontSize: number): HTMLDivElement => {
    const div = document.createElement('div');
    div.style.font = `${fontSize}px monospace`;
    div.style.position = 'absolute';
    div.style.backgroundColor = 'transparent';
    div.appendChild(document.createTextNode(content));
    return div;
  };

  // Write firecracker and stars
  const write_fire = (e: number) => {
    stars[e + 'r'] = createDiv('|', 12);
    if (firecrackerRef.current) {
      firecrackerRef.current.appendChild(stars[e + 'r']);
    }
    for (let t = bits * e; t < bits + bits * e; t++) {
      stars[t] = createDiv('*', 13);
      if (firecrackerRef.current) {
        firecrackerRef.current.appendChild(stars[t]);
      }
    }
  };

  // Launch rocket and set its trajectory
  const launch = (e: number) => {
    colour[e] = Math.floor(Math.random() * colours.length);
    Xpos[e + 'r'] = swide * 0.5;
    Ypos[e + 'r'] = shigh - 5;
    bangheight[e] = Math.round((0.5 + Math.random()) * shigh * 0.4);
    dX[e + 'r'] = ((Math.random() - 0.5) * swide) / bangheight[e];

    // Use optional chaining for safety
    if (stars[e + 'r']) {
        stars[e + 'r'].firstChild!.nodeValue = '|'; // Safe access
        stars[e + 'r'].style.color = colours[colour[e]];
    }
};

  // Explosion and star animation
  const bang = (e: number) => {
    let activeStars = 0;
    for (let t = bits * e; t < bits + bits * e; t++) {
      const starStyle = stars[t].style;
      starStyle.left = Xpos[t] + 'px';
      starStyle.top = Ypos[t] + 'px';

      if (decay[t]) decay[t]--;
      else activeStars++;

      if (decay[t] === 15) starStyle.fontSize = '7px';
      else if (decay[t] === 7) starStyle.fontSize = '2px';
      else if (decay[t] === 1) starStyle.visibility = 'hidden';

      Xpos[t] += dX[t];
      Ypos[t] += dY[t] += 1.25 / intensity[e];
    }

    if (activeStars !== bits) {
      setTimeout(() => bang(e), speed);
    }
  };

  // Launch the rocket and explode
  const stepthrough = (e: number) => {
    Xpos[e + 'r'] += dX[e + 'r'];
    Ypos[e + 'r'] -= 4;

    if (Ypos[e + 'r'] < bangheight[e]) {
      const randomColorIndex = Math.floor(Math.random() * colours.length);
      intensity[e] = 5 + Math.random() * 4;
      for (let t = e * bits; t < bits + bits * e; t++) {
        Xpos[t] = Xpos[e + 'r'];
        Ypos[t] = Ypos[e + 'r'];
        dY[t] = (Math.random() - 0.5) * intensity[e];
        dX[t] = (Math.random() - 0.5) * (intensity[e] - Math.abs(dY[t])) * 1.25;
        decay[t] = 16 + Math.floor(Math.random() * 16);
        stars[t].style.color = colours[randomColorIndex % colours.length];
        stars[t].style.fontSize = '13px';
        stars[t].style.visibility = 'visible';
      }
      bang(e);
      launch(e);
    }

    stars[e + 'r'].style.left = Xpos[e + 'r'] + 'px';
    stars[e + 'r'].style.top = Ypos[e + 'r'] + 'px';
  };

  useEffect(() => {
    set_width();
    window.addEventListener('resize', set_width);

    for (let e = 0; e < bangs; e++) {
      write_fire(e);
      launch(e);
      setInterval(() => stepthrough(e), speed);
    }

    return () => {
      window.removeEventListener('resize', set_width);
    };
  }, []);

  return <div ref={firecrackerRef}></div>;
};

export default Firecracker;
