import { Component, useRef, createRef, useCallback } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface FoodData {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface EditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  editingFood: FoodData;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<FoodData, 'id' | 'available'>) => void;
}

const ModalEditFood: React.FC<ModalProps> = ({ isOpen, editingFood, setIsOpen, handleUpdateFood }) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: EditFoodData) => {
      setIsOpen();
      handleUpdateFood(data);
    },
    [handleUpdateFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
