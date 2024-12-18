import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return size;
}

function CameraController() {
  const cameraRef = useRef();

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8); // Keep the camera fixed
    }
  });

  return <perspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} />;
}

function RotatingBox({ scrollY }) {
  const boxRef = useRef();
  const { width } = useWindowSize();

  // Responsive sizing
  const isMobile = width < 600;
  const boxSize = isMobile ? 1.5 : 2; 
  const sideTextSize = isMobile ? 0.3 : 0.4;

  useFrame(() => {
    if (boxRef.current) {
      const sidesCount = 4;
      const rotationStep = Math.PI / 2;
      const sideIndex = Math.min(Math.floor(scrollY / 300), sidesCount - 1);
      const targetRotation = sideIndex * rotationStep;

      boxRef.current.rotation.y += (targetRotation - boxRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[boxSize, boxSize, boxSize]} />
      <meshStandardMaterial color="#cccccc" />
      <Text
        position={[boxSize / 2 + 0.05, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={sideTextSize}
        color="black"
      >
        Services
      </Text>
      <Text
        position={[-(boxSize / 2 + 0.05), 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={sideTextSize}
        color="black"
      >
        Contact
      </Text>
      <Text
        position={[0, 0, boxSize / 2 + 0.05]}
        rotation={[0, 0, 0]}
        fontSize={sideTextSize}
        color="black"
      >
        Home
      </Text>
      <Text
        position={[0, 0, -(boxSize / 2 + 0.05)]}
        rotation={[0, Math.PI, 0]}
        fontSize={sideTextSize}
        color="black"
      >
        About
      </Text>
    </mesh>
  );
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [isBoxComplete, setIsBoxComplete] = useState(false);
  const [activeSideIndex, setActiveSideIndex] = useState(0);

  const sidesCount = 4;
  const scrollPerSide = 300; 
  const totalScrollDistance = sidesCount * scrollPerSide;
  
  const sideContent = [
    { title: "Home", text: "Welcome to our homepage content." },
    { title: "Contact", text: "Get in touch with us!" },
    { title: "About", text: "Learn more about us here." },
    { title: "Services", text: "We offer a variety of services." },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll >= totalScrollDistance) {
        setIsBoxComplete(true);
      } else {
        setIsBoxComplete(false);
        setScrollY(currentScroll);

        const newIndex = Math.min(Math.floor(currentScroll / scrollPerSide), sidesCount - 1);
        if (newIndex !== activeSideIndex) {
          setActiveSideIndex(newIndex);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalScrollDistance, sidesCount, scrollPerSide, activeSideIndex]);

  const { width } = useWindowSize();
  const isMobile = width < 600;

  return (
    <div>
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fade-in {
            animation: fadeInUp 0.6s ease-out;
          }
          @media (max-width: 600px) {
            h1 {
              font-size: 1.2rem;
            }
            p {
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      <div style={{ position: "relative", height: `${totalScrollDistance + 1000}px` }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Canvas style={{ width: "100%", height: "100%" }}>
              <CameraController />
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 0, 5]} />
              <RotatingBox scrollY={scrollY} />
            </Canvas>
            
            {/* Remove the condition for isBoxComplete here so the last text stays */}
            <div
              key={activeSideIndex}
              className="fade-in"
              style={{
                position: "absolute",
                bottom: "10%",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                padding: isMobile ? "10px" : "20px",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: isMobile ? "15px" : "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                  maxWidth: isMobile ? "90%" : "600px",
                }}
              >
                <h1 style={{ margin: "0 0 10px" }}>{sideContent[activeSideIndex].title}</h1>
                <p style={{ margin: 0 }}>{sideContent[activeSideIndex].text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional content after pinned section */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#e0e0e0",
          padding: isMobile ? "30px" : "50px",
        }}
      >
        <h1>Additional Content</h1>
        <p>Now that you've seen all sides, here's more content below!</p>
      </div>
    </div>
  );
}
