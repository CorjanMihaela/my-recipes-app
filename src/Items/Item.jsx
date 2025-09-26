import React from 'react';
import styles from './Item.module.css';

export function Item({ 
  item, 
  count = 1, 
  onDragStart, 
  position, 
  draggable = true, 
  itemType = 'inventory' 
}) {
  const handleDragStart = (e) => {
    if (!draggable) return;

    if (onDragStart) onDragStart(e, position, itemType, item.id);

    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ position, itemType, itemId: item.id })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.item}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className={styles.itemImage}>
        {typeof item.image === 'string' ? <img src={item.image} alt={item.name || 'item'} /> : item.image}
      </div>
      {count !== Infinity && count > 1 && <div className={styles.itemCount}>{count}</div>}
    </div>
  );
}
