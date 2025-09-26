// CraftingArea.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './CraftingArea.module.css';

export function CraftingArea() {
  const { state, dispatch, itemsData, recipesData } = useGame();
  const [slots, setSlots] = useState(Array(9).fill(null));
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const allItems = [...itemsData.resources, ...itemsData.craftedItems];

  // Check if current crafting pattern matches any recipe
  useEffect(() => {
    const checkRecipes = () => {
      for (const recipe of recipesData.recipes) {
        let matches = true;
        for (let i = 0; i < 9; i++) {
          const patternItem = recipe.pattern[i];
          const slotItem = slots[i];
          
          if ((patternItem === null && slotItem !== null) || 
              (patternItem !== null && slotItem !== patternItem)) {
            matches = false;
            break;
          }
        }
        
        if (matches) {
          setCurrentRecipe(recipe);
          return;
        }
      }
      setCurrentRecipe(null);
    };
    
    checkRecipes();
  }, [slots, recipesData.recipes]);

  const onDrop = (dragged) => {
  console.log('DROP DATA RECEIVED:', dragged);
  console.log('Source:', dragged.source);
  console.log('Item ID:', dragged.itemId);
  console.log('Target Type:', dragged.targetType);
    
    // Inventory → Crafting (permite mutarea în orice celulă)
    if (dragged.source === 'inventory' && dragged.targetType === 'crafting') {
      const newSlots = [...slots];
      const previousItem = newSlots[dragged.targetPosition];
      
      // Adaugă noul item în crafting
      newSlots[dragged.targetPosition] = dragged.itemId;
      setSlots(newSlots);
      
      // Dacă era deja un item în celulă, readaugă-l în inventar
      if (previousItem) {
        dispatch({ type: 'ADD_TO_INVENTORY', item: previousItem });
      }
      
      // Elimină itemul din inventar
      dispatch({ type: 'REMOVE_FROM_INVENTORY', item: dragged.itemId });
      return;
    }

    // Craft → Inventory
    if (dragged.source === 'crafting' && dragged.targetType === 'inventory') {
      const newSlots = [...slots];
      const itemToReturn = newSlots[dragged.position];
      newSlots[dragged.position] = null;
      setSlots(newSlots);
      if (itemToReturn) {
        dispatch({ type: 'ADD_TO_INVENTORY', item: itemToReturn });
      }
      return;
    }

    // Craft → Craft (rearrange)
    if (dragged.source === 'crafting' && dragged.targetType === 'crafting') {
      const newSlots = [...slots];
      const temp = newSlots[dragged.position];
      newSlots[dragged.position] = newSlots[dragged.targetPosition];
      newSlots[dragged.targetPosition] = temp;
      setSlots(newSlots);
      return;
    }

    // Craft → Garbage
    if (dragged.targetType === 'garbage' && dragged.source === 'crafting') {
      const newSlots = [...slots];
      const itemToReturn = newSlots[dragged.position];
      newSlots[dragged.position] = null;
      setSlots(newSlots);
      if (itemToReturn) {
        dispatch({ type: 'ADD_TO_INVENTORY', item: itemToReturn });
      }
    }
  };

  const { dragStart, dragEnter, drop, allowDrop } = useDragAndDrop(onDrop);

  const craftItem = () => {
  if (currentRecipe) {
    // Remove ingredients from inventory
    Object.entries(currentRecipe.ingredients).forEach(([item, quantity]) => {
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: 'REMOVE_FROM_INVENTORY', item });
      }
    });

    // Add crafted item → actualizează inventarul și discoveredItems
    dispatch({ type: 'ADD_CRAFTED_ITEM', item: currentRecipe.result });

    // Clear crafting grid
    setSlots(Array(9).fill(null));
  }
};



  const clearCraftingGrid = () => {
    const newSlots = [...slots];
    for (let i = 0; i < newSlots.length; i++) {
      if (newSlots[i]) {
        dispatch({ type: 'ADD_TO_INVENTORY', item: newSlots[i] });
        newSlots[i] = null;
      }
    }
    setSlots(newSlots);
  };

  return (
    <div className={styles.craftingArea}>
      <h2>Crafting Area</h2>
      <div className={styles.craftingWrapper}>
        <div className={styles.craftingGrid}>
          {slots.map((itemId, index) => (
            <div
              key={index}
              className={styles.craftingSlot}
              onDrop={(e) => drop(e, index, 'crafting')}
              onDragOver={allowDrop}
              onDragEnter={(e) => dragEnter(e, index)}
            >
              {itemId && (
                <div
                  draggable
                  // In CraftingArea.jsx - update the dragStart call
onDragStart={(e) =>
  dragStart(e, {
    source: 'crafting',
    position: index,
    itemId: itemId
  }, 'crafting', itemId)
}
                  className={styles.item}
                  style={{ backgroundColor: allItems.find(i => i.id === itemId)?.color + '40' }}
                >
                  {allItems.find(i => i.id === itemId)?.image}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.arrow}>➡</div>
        <div className={styles.resultSlot}>
          {currentRecipe ? (
            <div 
              className={styles.resultItem}
              onClick={craftItem}
              style={{ cursor: 'pointer' }}
            >
              {allItems.find(i => i.id === currentRecipe.result)?.image}
              <div className={styles.resultName}>{currentRecipe.name}</div>
            </div>
          ) : (
            <span style={{ color: '#aaa' }}>?</span>
          )}
        </div>
      </div>
      <button 
        className={styles.clearButton}
        onClick={clearCraftingGrid}
        disabled={slots.every(slot => slot === null)}
      >
        Clear Grid
      </button>
    </div>
  );
}