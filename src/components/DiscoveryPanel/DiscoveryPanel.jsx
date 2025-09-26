import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import styles from './DiscoveryPanel.module.css';

export const DiscoveryPanel = () => {
  const { state, recipesData, itemsData } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const allItems = [...itemsData.resources, ...itemsData.craftedItems];

  // 1️⃣ Adunăm toate obiectele descoperite sau create în ordinea cronologică
  const discoveredItems = state.discoveredItems
    .map(id => {
      const recipe = recipesData.recipes.find(r => r.result === id);
      if (recipe) {
        return {
          id: recipe.result,
          name: recipe.name,
          pattern: recipe.pattern,
        };
      } else {
        // Dacă obiectul există doar în inventar, dar nu are rețetă
        const item = allItems.find(i => i.id === id);
        if (item) return { id: item.id, name: item.name, pattern: [] };
      }
      return null;
    })
    .filter(Boolean);

  const renderItem = (item) => (
    <div key={item.id} className={styles.itemBlock}>
      <div className={styles.recipeDetails}>
        <h4>{item.name}</h4>
        {item.pattern.length > 0 && (
          <div className={styles.patternRow}>
            {item.pattern.map((id, idx) => {
              const ing = allItems.find(i => i.id === id);
              return (
                <div key={idx} className={styles.patternCell}>
                  {ing ? ing.image : ""}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "📖"}
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalPanel}>
            <h3>📖 Jurnal Descoperiri</h3>

            {discoveredItems.length > 0 ? (
              discoveredItems.map(renderItem)
            ) : (
              <p>Nu ai creat încă niciun obiect.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
