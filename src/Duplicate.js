// body, html, #root {
//     margin: 0;
//     padding: 0;
//     height: 100%;
//     font-family: Arial, sans-serif;
//   }
  
//   .Landingpage-header, .Landingpage-footer {
//     background-color: #282c34;
//     color: white;
//   }
  
//   .Landingpage-main {
//     height: 95vh;
//   }
  
//   .Landingpage-center-div {
//     position: relative;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
  
//   .Landingpage-second-sub-div {
//     position: relative;
//     text-align: center;
//     z-index: 1;
//     width: 80%; /* Adjust width as needed */
//     height: 100%; /* Ensure div takes full height */
//     background-size: cover; /* Ensures background covers the entire div */
//     background-position: center; /* Centers the background image */
//     background-repeat: no-repeat; /* Prevents background repetition */
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     position: absolute;
//   }
  
//   .Landingpage-background-image {
//     width: 100%;
//     height: auto;
//     opacity: 0.1;
//     position: absolute;
//     top: 0;
//     left: 0;
//     z-index: -1;
//   }
  
//   .Landingpage-scroll-container {
//     display: flex;
//     flex-direction: column;
//     width: 100%;
//     height: 90%;
//     overflow: hidden;
//     align-items: center;
//   }
  
//   .Landingpage-scroll-line {
//     display: flex;
//     white-space: nowrap;
//     animation: scroll 30s linear infinite;
//     width: 100%;
//   }
  
//   .reverse {
//     animation: scroll-reverse 30s linear infinite !important;
//   }
  
//   .Landingpage-image-container {
//     display: inline-block;
//     width: 120px;
//     height: 135px;
//     position: relative;
//     margin: 50px;
//     text-align: center;
//   }
  
//   .Landingpage-dummy-text {
//     font-size: 1rem;
//     text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
//     position: absolute;
//     top: 130%;
//     left: 97%;
//     font-weight: bold;
//     transform: translate(-50%, -50%);
//     color: #ffffff;
//     width: 100%;
//     background-color: rgba(255, 255, 255, 0.2); 
//     backdrop-filter: blur(10px); 
//     padding: 10px; 
//     border-radius: 8px; 
//   }
  
  
//   @keyframes scroll {
//     0% {
//         transform: translateX(0%);
//     }
//     100% {
//         transform: translateX(-120%);
//     }
//   }
  
//   @keyframes scroll-reverse {
//     0% {
//         transform: translateX(0%);
//     }
//     100% {
//         transform: translateX(-50%);
//     }
//   }
  
//   .Landingpage-image-container img {
//     width: auto;
//     height: 240px;
  
//   }
//   @media (max-width: 768px) {
//     .Landingpage-scroll-line {
//       height: 80vh; 
//     }
//     .Landingpage-image-container img {
//       width: auto;
//       height: 270px;
    
//     }
//   }
  
//   @media (max-width: 480px) {
//     .Landingpage-scroll-line {
//       height: 60vh; 
//     }
//     .Landingpage-image-container img {
//       width: auto;
//       height: 200px;
    
//     }
//   }
//   .logo-image {
//     width: 450px; 
//     height: auto;
//     margin-right: 10px; 
//   }








// HTMLAllCollection






// import React from 'react';
// import './Landingpage.css';
// import bg from './images/bg.png';
// import LOGO2 from './images/logo2.png';
// import HM1 from './images/6.png';
// import HM2 from './images/8.png';
// import HM3 from './images/7.png';
// import HM4 from './images/4.png';
// import HM5 from './images/5.png';



// function Landingpage() {
//   const logo = 'ASKOXY.ai';
//   const title = 'Any question to your abroad plan';

//   const images = [
//     { src: HM1, alt: 'Image 1', text: 'IT & AI Services' },
//     { src: HM2, alt: 'Image 2', text: 'Builder Loans' },
//     { src: HM3, alt: 'Image 3', text: 'legal Services' },
//     { src: HM4, alt: 'Image 4', text: 'Rental Services' },
//     { src: HM5, alt: 'Image 5', text: 'Global Education' }
//   ];

//   // Duplicate the images enough times to cover the scroll distance
//   const extendedImages = [...images, ...images, ...images, ...images, ...images]; 

//   return (
//     <div className="Landingpage d-flex flex-column min-vh-100">

//       <main className="Landingpage-main d-flex flex-grow-1 align-items-center justify-content-center">
//         <div className="Landingpage-center-div position-relative w-100 h-120 d-flex flex-column align-items-center justify-content-center">
//           <div
//             className="Landingpage-second-sub-div d-flex flex-column align-items-center justify-content-center text-center"
//             style={{
//               backgroundImage: `url(${bg})`,
//               backgroundSize: 'cover', // Cover the entire div
//               backgroundPosition: 'center', // Center the image
//               backgroundRepeat: 'no-repeat', // Do not repeat the image
//               width: '55%', // Adjust width as needed
//               height: '70%', // Adjust height as needed
//             }}
//           >
//            <img src={LOGO2} alt={logo} className="logo-image" />
//             {/* <div className="Landingpage-logo mb-3 fw-bold">{logo}</div> */}
//             <h1 className="Landingpage-title mb-3" >{title}</h1>
//             <input
//               type="text"
//               className="Landingpage-search form-control w-75 mx-auto"
//               placeholder="Looking for Universities..."
//               style={{width:'30%',padding:'12px'}}/>
//           </div>

//           <div className="Landingpage-scroll-container">
//             <div className="Landingpage-scroll-line">
//               {extendedImages.map((item, index) => (
//                 <div key={index} className="Landingpage-image-container">
//                   <img src={item.src} alt={item.alt} className="img-fluid" />
//                   <div className="Landingpage-dummy-text">{item.text}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="Landingpage-scroll-line reverse">
//               {extendedImages.map((item, index) => (
//                 <div key={index} className="Landingpage-image-container">
//                   <img src={item.src} alt={item.alt} className="img-fluid" />
//                   <div className="Landingpage-dummy-text">{item.text}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="Landingpage-scroll-line">
//               {extendedImages.map((item, index) => (
//                 <div key={index} className="Landingpage-image-container">
//                   <img src={item.src} alt={item.alt} className="img-fluid" />
//                   <div className="Landingpage-dummy-text">{item.text}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </main>

//     </div>
//   );
// }

// export default Landingpage;

