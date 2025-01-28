import { motion } from "framer-motion"

export const GreenBackgroundAnimation = () => {
  const generateLeaves = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * (100 - 40) + 40,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 8 + 15,
      delay: Math.random() * 2,
      color: `hsl(${Math.random() * 60 + 100}, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 70}%)`,
    }))
  }

  const leaves = generateLeaves(20)

  return (
    <>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute mix-blend-multiply filter blur-sm"
          style={{
            width: leaf.size,
            height: leaf.size,
            left: `${leaf.initialX}%`,
            top: `${leaf.initialY}%`,
            backgroundColor: leaf.color,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 0.4,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: leaf.delay,
          }}
        />
      ))}
      <motion.div
        className="absolute top-0 left-0 w-[1000px] h-[1000px] rounded-full bg-green-300/10 filter blur-3xl"
        initial={{
          x: -300,
          y: -300,
          scale: 1,
        }}
        animate={{
          x: [-300, 0, -300],
          y: [-300, 0, -300],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-emerald-400/10 filter blur-3xl"
        initial={{
          x: 300,
          y: 300,
          scale: 1.2,
        }}
        animate={{
          x: [300, 0, 300],
          y: [300, 0, 300],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
      />
    </>
  )
}

