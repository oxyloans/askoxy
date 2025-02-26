import React from "react";
import "./App1.css";
import { motion } from "framer-motion";

const RiceComparison: React.FC = () => {
  // Variants for staggering children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container">
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="title">Steam Rice vs. Raw Rice</h1> {/* Fixed typo */}
        <p className="greeting">Greetings from Radha</p>
      </motion.header>

      <motion.section
        className="video-section card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* <h3 className="video-title">Steame Rice vs. Raw Rice</h3>{" "} */}
        {/* Restored */}
        <div className="video-wrapper">
          <iframe
            className="youtube-video"
            src="https://www.youtube.com/embed/0Pd9td3kFNk?rel=0"
            title="Steam Rice vs. Raw Rice" /* Fixed typo */
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.section>

      <div className="content">
        <motion.section
          className="section card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="section-title steamed">Steam Rice vs Raw Rice</h2>{" "}
          {/* Fixed typo */}
          <p className="section-text">
            Paddy is brought from farmers to the mill. Once it reaches the mill,
            both types of rice—steam and raw—undergo processing. In both
            cases, the husk must be removed. However, the key difference lies in
            how the husk is treated.
          </p>
          <motion.div
            className="comparison"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="comparison-item steamed-bg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3>Steam Rice Process:</h3> {/* Fixed typo */}
              <p>
                In the steaming process, the paddy is first steam before being
                polished. As a result, the nutrients from the husk get absorbed
                into the grain, making steam rice a better choice.
              </p>
            </motion.div>
            <motion.div
              className="comparison-item raw-bg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3>Raw Rice Process:</h3>
              <p>
                Raw rice is polished directly without steaming, losing the
                husk’s nutrients. It requires thorough cleaning before cooking
                and isn’t as ready-to-cook as steam rice.
              </p>
            </motion.div>
          </motion.div>
          <p className="section-text tip">
            <strong>Tip:</strong> For something light and easy to digest, choose
            steam rice. {/* Fixed typo */}
          </p>
          <p className="section-text highlight">
            <strong>My Choice:</strong> Steam Rice – 51%, Raw Rice – 49%{" "}
            {/* Fixed typo */}
          </p>
        </motion.section>

        <motion.section
          className="section card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="section-title steamed">స్టీమ్ రైస్ vs రా రైస్</h2>
          <p className="section-text">
            రైతుల దగ్గర నుంచి వడ్లు మిల్లుకు వస్తాయి. మిల్లుకు వచ్చిన తర్వాత
            స్టీమ్ రైస్, రా రైస్—ఈ రెండూ ప్రాసెస్ చేయబడతాయి. ఏ విధంగానైనా తౌడు
            (husks) తొలగించాల్సిందే. అయితే, తౌడును ఎలా తొలగిస్తారనేదే ప్రధాన
            తేడా.
          </p>
          <motion.div
            className="comparison"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="comparison-item steamed-bg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3>స్టీమ్ రైస్ పద్ధతి:</h3>
              <p>
                స్టీమ్ రైస్ తయారీలో ముందుగా వడ్లను ఆవిరి (steam) ద్వారా
                ఉడికించి, ఆ తర్వాత పాలిష్ (polish) చేస్తారు. దీని వలన తౌడులోని
                పోషకాలు అన్నీ గింజలోకి చేరతాయి. అందువల్ల స్టీమ్ రైస్ ఎక్కువ పోషక
                విలువలతో ఉంటుంది.
              </p>
            </motion.div>
            <motion.div
              className="comparison-item raw-bg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3>రా రైస్ పద్ధతి:</h3>
              <p>
                రా రైస్ తయారీలో వడ్లను నేరుగా పాలిష్ చేసి తయారు చేస్తారు, దీంతో
                తౌడులోని పోషకాలు గింజకు చేరవు. ఇది నేరుగా మన ఇంటికి వస్తుంది,
                కానీ స్టీమ్ రైస్‌లా సిద్దంగా ఉండదు. రా రైస్‌ను వంటకు ముందుగా
                బాగా శుభ్రం చేసుకోవాలి.
              </p>
            </motion.div>
          </motion.div>
          <p className="section-text tip">
            <strong>సలహా:</strong> తేలికగా జీర్ణమయ్యే అన్నం కావాలంటే స్టీమ్ రైస్
            ఎంచుకోండి.
          </p>
          <p className="section-text highlight">
            <strong>నా ఎంపిక:</strong> స్టీమ్ రైస్ – 51%, రా రైస్ – 49%
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default RiceComparison;
