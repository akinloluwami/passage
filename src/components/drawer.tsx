import { ReactNode } from "react";
import { TiTimes } from "react-icons/ti";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  title: string;
}

const Drawer = ({ isOpen, children, onClose, title }: DrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="flex h-screen w-screen bg-black/10 fixed top-0 right-0 backdrop-blur-2xl z-10 items-center justify-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white mt-7 h-[calc(100vh-48px)] w-[450px] absolute right-4 p-5 rounded-3xl"
            onClick={(e) => {
              e.stopPropagation();
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, type: "keyframes" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2>{title}</h2>
              <button
                className="text-red-500 cursor-pointer flex items-center justify-center size-7 bg-gray-200 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                onClick={onClose}
              >
                <TiTimes size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
