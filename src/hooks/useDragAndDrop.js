import { useState } from 'react';

export function useDragAndDrop(onDropCallback) {
  const [draggedItem, setDraggedItem] = useState(null);

  const dragStart = (e, dragData, sourceType, itemId) => {
    // If dragData is already an object (from Inventory), use it as-is
    // Otherwise create a new object with the provided parameters
    const dataToTransfer = typeof dragData === 'object' 
      ? { ...dragData }
      : {
          source: sourceType,
          position: dragData,
          itemId: itemId
        };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dataToTransfer));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(dataToTransfer);
  };

  const dragEnter = (e, position) => {
    e.preventDefault();
  };

  const allowDrop = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const drop = (e, targetPosition, targetType) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      if (onDropCallback) {
        onDropCallback({
          ...data,
          targetPosition,
          targetType
        });
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  };

  return {
    dragStart,
    dragEnter,
    drop,
    allowDrop,
    draggedItem
  };
}