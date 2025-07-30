import React, { useState, useEffect } from "react";

const WelcomePage = () => {
  const [loading, setLoading] = useState(false); // State to track loading

  const handleJoinNowClick = () => {
    setLoading(true); // Show loading animation
    setTimeout(() => {
      window.location.href = "/login"; // Redirect after 1 second
    }, 1000);
  };

  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector(".welcome-page");
      if (!container) return;

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // Random positioning
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `${Math.random() * 20}%`;

        // Random size
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random animation duration
        const duration = Math.random() * 10 + 5;
        particle.style.animationDuration = `${duration}s`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(particle);
      }
    };

    createParticles();

    // Cleanup function to remove particles when component unmounts
    return () => {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <div className="welcome-page h-screen w-full font-sans text-white overflow-hidden">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

        .welcome-page {
          position: relative;
          width: 100%;
          height: 100vh;
          background: linear-gradient(
              rgba(97, 123, 228, 0.67),
              rgba(0, 0, 0, 0.7)
            ),
            url("/api/placeholder/1920/1080") center/cover no-repeat;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.61);
          border-radius: 50%;
          animation: float 8s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }

        .welcome-text {
          font-size: 4.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(45deg, rgba(39, 218, 242, 0.82), #63e2ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 1s ease-out;
        }

        .tagline {
          font-size: 1.5rem;
          font-weight: 300;
          margin-bottom: 30px;
          animation: fadeInUp 1s ease-out 0.3s forwards;
          opacity: 0;
        }

        .cta-button {
          position: relative;
          z-index: 10; /* Ensure button is above all other elements */
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(90deg, rgb(95, 191, 255), rgb(68, 121, 235));
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          animation: fadeInUp 1s ease-out 0.6s forwards;
        }

        .cta-button:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .cta-button {
            font-size: 0.9rem; /* Adjust font size for mobile */
            padding: 8px 16px; /* Adjust padding for mobile */
          }
        }

        .shape {
          position: absolute;
          opacity: 0.15;
          filter: blur(40px);
          z-index: 5;
        }

        .shape1,
        .shape2 {
          position: absolute;
          opacity: 0.15;
          filter: blur(40px);
          z-index: 1; /* Ensure shapes are behind the button */
        }

        .shape3 {
          top: 40%;
          right: 30%;
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #ffcf4a, #ff844a);
          border-radius: 30%;
          animation: moveShape 20s infinite alternate ease-in-out;
        }

        @keyframes moveShape {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(50px, 50px) rotate(180deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg px-4">
        <h1 className="welcome-text">Learning Management System</h1>
        <h2 className="welcome-text">(LMS)</h2>
        <p className="tagline">
          Discover, Learn, and Transform Your Knowledge Journey
        </p>
        <button
          className="cta-button"
          onClick={handleJoinNowClick}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Redirecting...
            </>
          ) : (
            "JOIN NOW"
          )}
        </button>

        {/* Custom SVG Wave */}
        <svg
          id="wave"
          style={{
            position: "absolute", // Position the wave
            bottom: 0, // Align it to the bottom
            left: 0, // Align it to the left
            width: "100%", // Make it span the full width
            transform: "rotate(0deg)",
            transition: "0.3s",
            opacity: 0.7,
          }}
          viewBox="0 0 1440 130"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
              <stop stopColor="rgba(109, 16, 230, 0.86)" offset="0%"></stop>
              <stop stopColor="rgba(60, 201, 226, 0.77)" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            style={{ transform: "translate(0, 0px)", opacity: 1 }}
            fill="url(#sw-gradient-0)"
            d="M0,26L12.6,36.8C25.3,48,51,69,76,67.2C101.1,65,126,39,152,23.8C176.8,9,202,4,227,10.8C252.6,17,278,35,303,49.8C328.4,65,354,78,379,75.8C404.2,74,429,56,455,52C480,48,505,56,531,60.7C555.8,65,581,65,606,73.7C631.6,82,657,100,682,106.2C707.4,113,733,108,758,95.3C783.2,82,808,61,834,62.8C858.9,65,884,91,909,104C934.7,117,960,117,985,104C1010.5,91,1036,65,1061,65C1086.3,65,1112,91,1137,95.3C1162.1,100,1187,82,1213,80.2C1237.9,78,1263,91,1288,86.7C1313.7,82,1339,61,1364,47.7C1389.5,35,1415,30,1440,28.2C1465.3,26,1491,26,1516,23.8C1541.1,22,1566,17,1592,19.5C1616.8,22,1642,30,1667,41.2C1692.6,52,1718,65,1743,75.8C1768.4,87,1794,95,1806,99.7L1818.9,104L1818.9,130L1806.3,130C1793.7,130,1768,130,1743,130C1717.9,130,1693,130,1667,130C1642.1,130,1617,130,1592,130C1566.3,130,1541,130,1516,130C1490.5,130,1465,130,1440,130C1414.7,130,1389,130,1364,130C1338.9,130,1314,130,1288,130C1263.2,130,1238,130,1213,130C1187.4,130,1162,130,1137,130C1111.6,130,1086,130,1061,130C1035.8,130,1011,130,985,130C960,130,935,130,909,130C884.2,130,859,130,834,130C808.4,130,783,130,758,130C732.6,130,707,130,682,130C656.8,130,632,130,606,130C581.1,130,556,130,531,130C505.3,130,480,130,455,130C429.5,130,404,130,379,130C353.7,130,328,130,303,130C277.9,130,253,130,227,130C202.1,130,177,130,152,130C126.3,130,101,130,76,130C50.5,130,25,130,13,130L0,130Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default WelcomePage;
