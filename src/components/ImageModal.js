import React from "react";
import { Button, Modal, Image, Center } from "native-base";

export const ImageModal = ({ showModal, setShowModal }) => {
  return (
    <Center>
      <Modal
        isOpen={showModal.open}
        onClose={() => setShowModal({ ...showModal, open: false })}
        size="full"
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Image Preview</Modal.Header>
          <Modal.Body>
            <Image
              source={{
                uri: showModal.img
              }}
              alt="Image"
              size="2xl"
              width="100%"
              resizeMode={"contain"}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};
