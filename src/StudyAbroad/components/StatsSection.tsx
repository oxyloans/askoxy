import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface StatisticsProps {
  title?: string;
}

const Statistics: React.FC<StatisticsProps> = ({
  title = "Why Choose AskOxy AI?",
}) => {
  const [counts, setCounts] = useState({
    universities: 0,
    countries: 0,
    students: 0,
    visaSuccess: 0,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (!inView) return;

    const targets = {
      universities: 1000,
      countries: 25,
      students: 10000,
      visaSuccess: 95,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        universities: Math.floor(targets.universities * progress),
        countries: Math.floor(targets.countries * progress),
        students: Math.floor(targets.students * progress),
        visaSuccess: Math.floor(targets.visaSuccess * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [inView]);

  const stats = [
    {
      icon: "🏫",
      label: "Universities",
      value: counts.universities.toLocaleString(),
      suffix: "+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🌍",
      label: "Countries",
      value: counts.countries,
      suffix: "+",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "👨‍🎓",
      label: "Students Guided",
      value: counts.students.toLocaleString(),
      suffix: "+",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: "✓",
      label: "Visa Success Rate",
      value: counts.visaSuccess,
      suffix: "%",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-16"
    >
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div
              className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110`}
            >
              <div className="bg-white rounded-2xl p-8 h-full">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="mb-2">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                    <span className="text-2xl md:text-3xl">{stat.suffix}</span>
                  </div>
                </div>

                {/* Label */}
                <div className="text-gray-700 font-semibold text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Statistics;
