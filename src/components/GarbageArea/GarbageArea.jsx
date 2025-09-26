import React, { useState } from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useGame } from '../../context/GameContext';
import styles from './GarbageArea.module.css';

export function GarbageArea() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { dispatch } = useGame();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      console.log('Dropped on garbage:', draggedData);

      // Elimină itemul din sursa corespunzătoare
      if (draggedData.source === 'inventory') {
        dispatch({ type: 'REMOVE_FROM_INVENTORY', item: draggedData.itemId });
      } else if (draggedData.source === 'crafting' && draggedData.removeFromSource) {
        draggedData.removeFromSource();
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div
      className={`${styles.garbageArea} ${isDragOver ? styles.dragOver : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h2>🗑️ Garbage</h2>
      <p>Drag items here to delete</p>
    </div>
  );
}