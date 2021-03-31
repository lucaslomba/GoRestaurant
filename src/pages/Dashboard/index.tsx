import { Component, useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


interface FoodData {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {

  const [foods, setFoods] = useState<FoodData[]>([])
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOPen] = useState(false)

  useEffect(() => {
    async function loadFoods(): Promise<void>{
      const { data } = await api.get('/foods');
      setFoods(data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: Omit<FoodData, 'id' | 'available'>,): Promise<void>{
    try{
      const { image, name, description, price} = food

      const response = await api.post('/foods', {
        image,
        name,
        description,
        price,
        available: true, 
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.error(err)
    }
  }

  async function handleUpdateFood (food: Omit<FoodData, 'id' | 'available'>,): Promise<void>{
    const currentListFood = foods.map(currentFood => {
      if(currentFood.id !== editingFood.id){
        return currentFood;
      }

      return {
        ...food,
        id: editingFood.id,
        available: editingFood.available
      }
    })

    setFoods(currentListFood)

    await api.put(`/foods/${editingFood.id}`, {
      ...food,
      id: editingFood.id,
      available: editingFood.available
    })
  }

  async function handleDeleteFood(id:number): Promise<void>{
    await api.delete(`/foods/${id}`)

    setFoods(foods.filter(food => food.id !== id))
  }



  function toggleModal(): void{
    setModalOpen(!modalOpen)
  }

  function toggleEditModal(): void {
    setEditModalOPen(!editModalOpen)
  }

  function handleEditFood (food : FoodData): void{
    setEditingFood(food)
    toggleEditModal()
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
