import React from 'react';
import { useGame } from "../../context/GameContext";
import styles from './RecipesList.module.css';

export function RecipesList() {
  const { state, recipesData, itemsData } = useGame();
  const allItems = [...itemsData.resources, ...itemsData.craftedItems];

  // Rețetele care pot fi create, fără cele deja create
  const craftableRecipes = recipesData.recipes.filter(recipe => {
  if (state.craftedItems[recipe.result]) return false; // deja creat
  return Object.entries(recipe.ingredients).some(
    ([item, qty]) => (state.inventory[item] || 0) > 0
  );
});

  return (
    <div className={styles.recipesPanel}>
      {craftableRecipes.map(recipe => {
        const item = allItems.find(i => i.id === recipe.result);
        return (
          <div key={recipe.id} className={styles.recipeItem}>
            <span className={styles.itemImage}>{item?.image}</span>
          </div>
        );
      })}
    </div>
  );
}
