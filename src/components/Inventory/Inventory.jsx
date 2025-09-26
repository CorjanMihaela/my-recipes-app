// Inventory.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './Inventory.module.css';

export function Inventory({ addItemToCrafting }) {
  const { state, dispatch, itemsData } = useGame();
  const totalSlots = 18;
  const allItems = [...itemsData.resources, ...itemsData.craftedItems];

  // Inventory.jsx - Update the onDrop function
const onDrop = (dragged) => {
  // Din ResourcesBar → Inventory
  if (dragged.source === 'resourcesBar' && dragged.targetType === 'inventory') {
    dispatch({ type: 'ADD_TO_INVENTORY', item: dragged.itemId });
    return;
  }

  // Din Crafting → Inventory
  if (dragged.source === 'crafting' && dragged.targetType === 'inventory') {
    if (dragged.removeFromSource) {
      dragged.removeFromSource();
    }
    return;
  }

  // Din Inventory → Inventory (mutare sloturi)
  if (dragged.source === 'inventory' && dragged.targetType === 'inventory') {
    const itemId = dragged.itemId;
    dispatch({ type: 'REMOVE_FROM_INVENTORY', item: itemId });
    dispatch({ type: 'ADD_TO_INVENTORY', item: itemId });
    return;
  }

  // Din Inventory → Garbage
  if (dragged.source === 'inventory' && dragged.targetType === 'garbage') {
    if (dragged.removeFromSource) {
      dragged.removeFromSource();
    }
  }
};

  const { dragStart, drop, allowDrop } = useDragAndDrop(onDrop);

  const inventoryItems = [];
  for (const [itemId, count] of Object.entries(state.inventory)) {
    const item = allItems.find((i) => i.id === itemId);
    if (item && count > 0) {
      for (let i = 0; i < count; i++) inventoryItems.push({ ...item });
    }
  }
  while (inventoryItems.length < totalSlots) inventoryItems.push(null);

  return (
    <div className={styles.inventory}>
      <h2>Inventory</h2>
      <div className={styles.inventoryGrid}>
        {inventoryItems.map((item, index) => (
          <div
            key={index}
            className={styles.inventorySlot}
            onDrop={(e) => drop(e, index, 'inventory')}
            onDragOver={allowDrop}
          >
            {item ? (
              <div
                draggable
                onDragStart={(e) =>
  dragStart(e, {
    source: 'inventory',
    position: index,
    itemId: item.id,
    removeFromSource: () => {
      dispatch({ type: 'REMOVE_FROM_INVENTORY', item: item.id });
    }
  }, 'inventory', item.id)
}
                className={styles.item}
                style={{ backgroundColor: item.color + '40' }}
              >
                <span className={styles.itemImage}>{item.image}</span>
                <span className={styles.itemName}>{item.name}</span>
              </div>
            ) : (
              <span style={{ color: '#aaa' }}>–</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}