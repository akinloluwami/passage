import { useGlobalModal, ModalKey } from "../stores/global-modal";
import AddPassword from "./modals/add-password";

const Modal = () => {
  const { modalKey, setModalKey } = useGlobalModal();

  const modal = () => {
    switch (modalKey) {
      case ModalKey.ADD_PASSWORD:
        return <AddPassword />;
      default:
        return null;
    }
  };
  return (
    <>
      {!!modalKey && (
        <div
          className="flex h-screen w-screen bg-black/10 fixed top-0 right-0 backdrop-blur-2xl z-10 items-center justify-center"
          onClick={() => setModalKey(ModalKey.BLANK)}
        >
          <div
            className=""
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {modal()}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
