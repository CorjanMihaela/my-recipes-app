import React from 'react';
import { useGame } from '../../context/GameContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './ResourcesBar.module.css';

// Alternative simplified ResourcesBar.jsx
export function ResourcesBar() {
  const { itemsData, dispatch } = useGame();
  const { dragStart } = useDragAndDrop();

  const handleDragStart = (e, resource) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'resourcesBar',
      itemId: resource.id,
      itemType: 'resource'
    }));
  };

  return (
    <div className={styles.resourcesBar}>
      <h3>Resources</h3>
      <div className={styles.resourcesGrid}>
        {itemsData.resources.map((resource) => (
          <div
            key={resource.id}
            className={styles.resourceItem}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, resource)}
            style={{ borderColor: resource.color }}
          >
            <div className={styles.resourceImage}>{resource.image}</div>
            <div className={styles.resourceCount}>∞</div>
            <div className={styles.resourceName}>{resource.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
