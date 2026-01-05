import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const StatisticItem = ({ target, label, delay }: { target: number; label: string; delay: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = target / 100; // Increment step for each frame
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev < target) {
          return Math.min(prev + increment, target); // Ensure the number doesn't exceed the target
        }
        clearInterval(interval);
        return target;
      });
    }, 20); // Update every 20 milliseconds

    return () => clearInterval(interval); // Cleanup interval when the component unmounts
  }, [target]);

  return (
    <motion.div
      className="text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
    >
      <h3 className="text-6xl font-bold">
        {Math.floor(count)}+
      </h3>
      <p className="text-lg mt-2">{label}</p>
    </motion.div>
  );
};

const Statistics = () => {
  return (
    <div className="bg-[#B749DB] py-12 pt-10">
      <div className="text-center font-roboto-condensed mb-10">
        <h2 className="text-white text-4xl font-bold">Our Achievements</h2>
        <p className="text-white text-xl mt-2">We take pride in our journey and milestones</p>
      </div>

      <div className="flex justify-center space-x-12 font-roboto">
        {/* Statistic 1 */}
        <StatisticItem target={1000} label="Satisfied Customers" delay={0.2} />

        {/* Statistic 2 */}
        <StatisticItem target={500} label="Active Members" delay={0.4} />

        {/* Statistic 3 */}
        <StatisticItem target={100} label="Tour Destinations" delay={0.6} />

        {/* Statistic 4 */}
        <StatisticItem target={75} label="Tour Guides" delay={0.8} />
      </div>
    </div>
  );
};

export default Statistics;
