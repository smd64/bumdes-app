import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function Dashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000); // simulasi loading 3 detik
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Button onClick={openModal} variant="primary">
        Open Modal
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Modal Title">
        <p className="mb-4">Ini konten modal. Klik di luar atau Escape untuk tutup.</p>
        <Button onClick={simulateLoading} variant="secondary">
          Simulate Loading
        </Button>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner size={8} />
          </div>
        )}
      </Modal>
    </div>
  );
}
