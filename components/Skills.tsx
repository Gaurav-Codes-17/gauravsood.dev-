"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skills = {
    frontend: [
      { name: "React", level: 95, color: "from-cyan-400 to-blue-500" },
      { name: "Next.js", level: 90, color: "from-gray-400 to-gray-600" },
      { name: "TypeScript", level: 90, color: "from-blue-500 to-blue-600" },
      { name: "Tailwind CSS", level: 95, color: "from-cyan-400 to-teal-500" },
      { name: "Framer Motion", level: 85, color: "from-pink-500 to-purple-500" },
    ],
    backend: [
      { name: "Node.js", level: 90, color: "from-green-500 to-green-600" },
      { name: "Express", level: 85, color: "from-gray-500 to-gray-700" },
      { name: "MongoDB", level: 85, color: "from-green-600 to-green-700" },
      { name: "PostgreSQL", level: 80, color: "from-blue-600 to-blue-700" },
      { name: "REST APIs", level: 90, color: "from-orange-500 to-red-500" },
    ],
    tools: [
      { name: "Git", level: 90, color: "from-orange-600 to-red-600" },
      { name: "Docker", level: 75, color: "from-blue-500 to-blue-700" },
      { name: "AWS", level: 70, color: "from-yellow-600 to-orange-600" },
      { name: "Vercel", level: 85, color: "from-gray-700 to-black" },
      { name: "Figma", level: 80, color: "from-purple-500 to-pink-500" },
    ],
  };

  return (
    <section id="skills" className="relative py-32 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Tech Constellation</span>
          </h2>
          <p className="text-xl text-gray-400">My arsenal of technologies</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIndex * 0.2 }}
              className="glass-effect p-8 rounded-3xl relative overflow-hidden group"
            >
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 capitalize text-gradient">
                  {category}
                </h3>

                <div className="space-y-6">
                  {items.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>

                      {/* Skill bar with constellation effect */}
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${skill.color} relative`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            duration: 1,
                            delay: catIndex * 0.2 + index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          {/* Moving star on the bar */}
                          <motion.div
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner stars */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: catIndex * 0.3,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}