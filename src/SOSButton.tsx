import React, { useState, useEffect } from 'react';

const SOSButton: React.FC = () => {
  const phoneNumber = '+916306246825'; // WhatsApp number
  const emailAddress = 'mgaurav9211@gmail.com'; // Emergency email address
  const emergencyPhoneNumber = '+916306246825'; // Emergency phone number

  const [isLoading, setIsLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Play SOS sound
  const handleSoundSOSClick = (): void => {
    const sosSound = new Audio('/morse-sos-93449.mp3'); // Move this inside to avoid autoplay issues
    sosSound.play();
    setTimeout(() => {
      sosSound.pause();
      sosSound.currentTime = 0;
    }, 5000);
  };

  // Send SOS via WhatsApp
  const handleMessageSOSClick = (): void => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = `SOS! My location: https://www.google.com/maps?q=${latitude},${longitude}`;
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(locationMessage)}`;
          window.open(whatsappUrl, '_blank');
          setIsLoading(false);
        },
        () => {
          alert('Failed to retrieve location.');
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported.');
      setIsLoading(false);
    }
  };

  // Flashlight effect (screen flashing as a strobe)
  const handleFlashlightSOSClick = (): void => {
    let flashes = 0;
    const intervalId = setInterval(() => {
      document.body.style.backgroundColor = flashes % 2 === 0 ? 'red' : 'blue';
      flashes += 1;
      if (flashes > 10) {
        clearInterval(intervalId);
        document.body.style.backgroundColor = ''; // Reset to original color
      }
    }, 300); // Strobe effect speed
  };

  // Call emergency contact
  const handleCallSOSClick = (): void => {
    window.location.href = `tel:${emergencyPhoneNumber}`;
  };

  // Send SOS email
  const handleEmailSOSClick = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = `SOS! My current location is: https://www.google.com/maps?q=${latitude},${longitude}`;
          const mailtoLink = `mailto:${emailAddress}?subject=SOS Emergency&body=${encodeURIComponent(locationMessage)}`;
          window.open(mailtoLink, '_blank');
        },
        () => {
          alert('Failed to retrieve location for email.');
        }
      );
    } else {
      alert('Geolocation is not supported for email.');
    }
  };

  // Live Location Sharing via WhatsApp
  const handleLiveLocationClick = (): void => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationMessage = `Live Location Update: https://www.google.com/maps?q=${latitude},${longitude}`;
          const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(locationMessage)}`;
          window.open(whatsappUrl, '_blank');
        },
        (error) => {
          alert('Failed to retrieve live location.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setWatchId(id);
    } else {
      alert('Geolocation is not supported.');
    }
  };

  // Stop Live Location Sharing
  const handleStopLiveLocationClick = (): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      alert('Live location sharing stopped.');
    }
  };

  // Shake detection feature
  useEffect(() => {
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    const threshold = 20; // Adjust this value for shake sensitivity

    const handleMotionEvent = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const currentTime = new Date().getTime();

      if (currentTime - lastTime > 100) { // Check every 100ms
        const timeDifference = currentTime - lastTime;
        lastTime = currentTime;

        const deltaX = x - lastX;
        const deltaY = y - lastY;
        const deltaZ = z - lastZ;
        const speed = Math.abs(deltaX + deltaY + deltaZ) / timeDifference * 10000;

        if (speed > threshold) {
          alert("Shake detected! Activating SOS.");
          handleSoundSOSClick(); // Trigger SOS
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    window.addEventListener('devicemotion', handleMotionEvent);

    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {/* Background div */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

      {/* Buttons Container */}
      <div style={styles.container}>
        <button style={styles.soundButton} onClick={handleSoundSOSClick}>Play SOS Sound</button>
        <button style={styles.messageButton} onClick={handleMessageSOSClick} disabled={isLoading}>
          {isLoading ? 'Fetching Location...' : 'Send SOS Message'}
        </button>
        <button style={styles.flashlightButton} onClick={handleFlashlightSOSClick}>Activate Flashlight</button>
        <button style={styles.callButton} onClick={handleCallSOSClick}>Call Emergency</button>
        <button style={styles.emailButton} onClick={handleEmailSOSClick}>Send SOS Email</button>
        <button style={styles.liveLocationButton} onClick={handleLiveLocationClick}>Start Live Location Sharing</button>
        {/* <button style={styles.stopLocationButton} onClick={handleStopLiveLocationClick}>Stop Live Location Sharing</button> */}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    zIndex: 10, // Ensure buttons are above the background
  },
  soundButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  messageButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  flashlightButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  callButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#ff6347',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  emailButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#1e90ff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  liveLocationButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#32CD32',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
  stopLocationButton: {
    padding: '20px 40px',
    fontSize: '20px',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    margin: '10px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default SOSButton;
