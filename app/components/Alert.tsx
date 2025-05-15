import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  showAlertAtom
} from "../atom";
import { useAtom } from "jotai";

type AlertProps = {
  mainText: string;
  subText?: string;
};

const Alert: React.FC<AlertProps> = ({ mainText, subText }) => {
  const [showAlert] = useAtom(showAlertAtom);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs z-[100000000]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-full px-8 py-4 shadow-md flex flex-col items-center opacity-95">
            <span className="text-gray-800 font-semibold text-sm text-center">
              {mainText}
            </span>
            {subText && (
              <span className="text-blue-500 font-medium text-xs mt-1 text-center">
                {subText}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
