import { useState, useEffect } from 'react';
import '../styles/InspirationBanner.css';

const inspirationGifs = [
  '/NoKings.gif',
  '/Resist.gif',
  '/letOurVotesBeHeard.gif',
];

function InspirationBanner() {
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % inspirationGifs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inspiration-banner">
      <div className="inspiration-content">
        <p className="inspiration-text">Din stemme er viktig</p>
        <div className="inspiration-gif-container">
          <img 
            src={inspirationGifs[currentGif]} 
            alt="Inspirasjon" 
            className="inspiration-gif"
            key={currentGif}
          />
        </div>
      </div>
    </div>
  );
}

export default InspirationBanner;

