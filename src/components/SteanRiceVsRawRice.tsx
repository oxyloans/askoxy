import React from "react";
import { motion } from "framer-motion";

const RiceComparison = () => {
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Steam Rice vs. Raw Rice
        </h1>
        <p className="text-xl text-gray-600">Greetings from Radha</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Telugu Video - Left Side */}
        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* <h3 className="text-xl font-bold text-gray-800 mb-3">
            తెలుగు వీడియో
          </h3> */}
          <div className="w-full h-0 pb-[58.78%] relative mb-4">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/asyT8Vu_DqQ"
              title="Steam Rice vs. Raw Rice - Telugu"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.section>

        {/* English Video - Right Side */}
        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* <h3 className="text-xl font-bold text-gray-800 mb-3">
            English Video
          </h3> */}
          <div className="w-full h-0 pb-[58.78%] relative mb-4">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/Te772XSOeHg"
              title="Steam Rice vs. Raw Rice - English"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Steam Rice vs Raw Rice
          </h2>
          <p className="text-gray-700 mb-6">
            Paddy is brought from farmers to the mill. Once it reaches the mill,
            both types of rice—steam and raw—undergo processing. In both cases,
            the husk must be removed. However, the key difference lies in how
            the husk is treated.
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-bold text-green-700 mb-3">
                Steam Rice Process:
              </h3>
              <p className="text-gray-700">
                In the steaming process, the paddy is first steam before being
                polished. As a result, the nutrients from the husk get absorbed
                into the grain, making steam rice a better choice.
              </p>
            </motion.div>
            <motion.div
              className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-bold text-yellow-700 mb-3">
                Raw Rice Process:
              </h3>
              <p className="text-gray-700">
                Raw rice is polished directly without steaming, losing the
                husk's nutrients. It requires thorough cleaning before cooking
                and isn't as ready-to-cook as steam rice.
              </p>
            </motion.div>
          </motion.div>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg mb-4">
            <strong className="text-blue-700">Tip:</strong> For something light
            and easy to digest, choose steam rice.
          </p>
          <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
            <strong className="text-purple-700">My Choice:</strong> Steam Rice –
            51%, Raw Rice – 49%
          </p>
        </motion.section>

        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            స్టీమ్ రైస్ vs రా రైస్
          </h2>
          <p className="text-gray-700 mb-6">
            రైతుల దగ్గర నుంచి వడ్లు మిల్లుకు వస్తాయి. మిల్లుకు వచ్చిన తర్వాత
            స్టీమ్ రైస్, రా రైస్—ఈ రెండూ ప్రాసెస్ చేయబడతాయి. ఏ విధంగానైనా తౌడు
            (husks) తొలగించాల్సిందే. అయితే, తౌడును ఎలా తొలగిస్తారనేదే ప్రధాన
            తేడా.
          </p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-bold text-green-700 mb-3">
                స్టీమ్ రైస్ పద్ధతి:
              </h3>
              <p className="text-gray-700">
                స్టీమ్ రైస్ తయారీలో ముందుగా వడ్లను ఆవిరి (steam) ద్వారా
                ఉడికించి, ఆ తర్వాత పాలిష్ (polish) చేస్తారు. దీని వలన తౌడులోని
                పోషకాలు అన్నీ గింజలోకి చేరతాయి. అందువల్ల స్టీమ్ రైస్ ఎక్కువ పోషక
                విలువలతో ఉంటుంది.
              </p>
            </motion.div>
            <motion.div
              className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <h3 className="text-xl font-bold text-yellow-700 mb-3">
                రా రైస్ పద్ధతి:
              </h3>
              <p className="text-gray-700">
                రా రైస్ తయారీలో వడ్లను నేరుగా పాలిష్ చేసి తయారు చేస్తారు, దీంతో
                తౌడులోని పోషకాలు గింజకు చేరవు. ఇది నేరుగా మన ఇంటికి వస్తుంది,
                కానీ స్టీమ్ రైస్‌లా సిద్దంగా ఉండదు. రా రైస్‌ను వంటకు ముందుగా
                బాగా శుభ్రం చేసుకోవాలి.
              </p>
            </motion.div>
          </motion.div>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg mb-4">
            <strong className="text-blue-700">సలహా:</strong> తేలికగా జీర్ణమయ్యే
            అన్నం కావాలంటే స్టీమ్ రైస్ ఎంచుకోండి.
          </p>
          <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
            <strong className="text-purple-700">నా ఎంపిక:</strong> స్టీమ్ రైస్ –
            51%, రా రైస్ – 49%
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default RiceComparison;
