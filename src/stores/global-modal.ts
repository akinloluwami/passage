import { create } from "zustand";

enum ModalKey {
  ADD_PASSWORD = "add-password",
  BLANK = "",
}

interface GlobalModalProps {
  modalKey: ModalKey;
  setModalKey: (modalKey: ModalKey) => void;
}

export const useGlobalModal = create<GlobalModalProps>((set) => ({
  modalKey: ModalKey.BLANK,
  setModalKey: (modalKey) => set({ modalKey }),
}));

export { ModalKey };
