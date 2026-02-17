import { motion } from 'framer-motion';

const AntigravityBackground = () => {
    // Generate random particles
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 100 + 50, // 50px to 150px
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        duration: Math.random() * 20 + 10, // 10s to 30s
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-purple-500/10 blur-3xl"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0], // Float up and down
                        x: [0, 50, -50, 0], // Drift sideways
                        scale: [1, 1.2, 0.9, 1], // Pulse size
                        opacity: [0.3, 0.6, 0.3], // Fade in/out
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: particle.delay,
                        times: [0, 0.5, 1], // Keyframe timing
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
        </div>
    );
};

export default AntigravityBackground;
