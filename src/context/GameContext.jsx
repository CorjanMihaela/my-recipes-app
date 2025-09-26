import React, { createContext, useContext, useReducer, useEffect } from 'react';
import itemsData from '../data/items.json';
import recipesData from '../data/recipes.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GameContext = createContext();

const initialState = {
  inventory: {},
  discoveredItems: [],
  craftedItems: {},
  showVictory: false
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_INVENTORY':
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.item]: (state.inventory[action.item] || 0) + 1
        }
      };

    case 'REMOVE_FROM_INVENTORY': {
      const newCount = Math.max(0, (state.inventory[action.item] || 0) - 1);
      const newInventory = { ...state.inventory };
      if (newCount === 0) delete newInventory[action.item];
      else newInventory[action.item] = newCount;
      return { ...state, inventory: newInventory };
    }

    case 'ADD_CRAFTED_ITEM': {
  const newCraftedItems = {
    ...state.craftedItems,
    [action.item]: (state.craftedItems[action.item] || 0) + 1
  };

  const newInventory = {
    ...state.inventory,
    [action.item]: (state.inventory[action.item] || 0) + 1
  };

  const newDiscoveredItems = state.discoveredItems.includes(action.item)
    ? state.discoveredItems
    : [...state.discoveredItems, action.item];

  return {
    ...state,
    craftedItems: newCraftedItems,
    inventory: newInventory,
    discoveredItems: newDiscoveredItems
  };
}



    case 'SHOW_VICTORY':
      return { ...state, showVictory: true };

    case 'RESET_GAME':
      return { ...initialState };

    case 'LOAD_SAVED_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [savedState, setSavedState] = useLocalStorage('gameState', initialState);

  const [state, dispatch] = useReducer(gameReducer, savedState || initialState);

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  useEffect(() => {
    const finalItem = 'finalItem';
    if ((state.discoveredItems.includes(finalItem) || state.craftedItems[finalItem]) && !state.showVictory) {
      dispatch({ type: 'SHOW_VICTORY' });
    }
  }, [state.discoveredItems, state.craftedItems, state.showVictory]);

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
    setSavedState(initialState);
  };

  return (
    <GameContext.Provider value={{ state, dispatch, handleReset, itemsData, recipesData }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}
