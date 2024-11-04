import { useMemo } from 'react'
import { motion } from 'framer-motion'

import ProgressCheckIcon from '../../assets/icons/progressCheckIcon'
import ProgressCheckpointIcon from '../../assets/icons/progressCheckpointIcon'

function StickyProgress({ index, checkpoints }) {
  const checkpointIndices = useMemo(
    () => Array.from({ length: checkpoints.length }, (_, i) => i),
    [checkpoints],
  )
  return (
    <div className="sticky h-fit mx-auto top-0 z-10 py-5 md:py-10 max-w-[90%]">
      <div className="w-full max-w-md mx-auto">
        <div className="relative flex justify-between">
          {checkpointIndices.map((i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                className={`w-6 h-6 md:w-10 md:h-10 !rounded-full flex items-center justify-center relative ${
                  i <= index ? 'bg-blue-500' : 'bg-primary-50'
                }`}
                initial={false}
                animate={{
                  scale: i === index ? 1.2 : 1,
                  transition: { duration: 0.3 },
                }}
                style={{
                  boxShadow:
                    i === index
                      ? '0px 0px 0px 6.667px rgba(41, 87, 255, 0.20)'
                      : '',
                }}
              >
                {i < index && (
                  <ProgressCheckIcon className="w-6 h-6 md:w-10 md:h-10 text-white rounded-full overflow-hidden" />
                )}
                {i === index && (
                  <ProgressCheckpointIcon className="w-6 h-6 md:w-10 md:h-10 text-white rounded-full overflow-hidden" />
                )}
              </motion.div>
              <div className="max-lg:hidden font-secondary text-neutral-700 absolute -bottom-14 text-nowrap">
                {checkpoints[i]}
              </div>
            </div>
          ))}
          <div className="absolute top-3 md:top-4 left-0 w-full -z-10">
            <motion.div
              className="h-1 bg-blue-500"
              initial={{ width: '0%' }}
              animate={{
                width: `${(index / (checkpoints.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyProgress
