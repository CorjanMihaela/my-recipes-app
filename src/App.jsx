import { useGame } from './context/GameContext';
import { Inventory } from './components/Inventory/Inventory';
import { CraftingArea } from './components/CraftingArea/CraftingArea';
import { ResourcesBar } from './components/ResourcesBar/ResourcesBar';
import { GarbageArea } from './components/GarbageArea/GarbageArea';
import { RecipesList } from './components/RecipesList/RecipesList';
import { DiscoveryPanel } from './components/DiscoveryPanel/DiscoveryPanel'; 
import  VictoryModal  from './components/VictoryModal/VictoryModal';

import styles from './App.module.css';

function App() {
  const { state, dispatch } = useGame();

  const handleReset = () => {
    if (window.confirm('Reset game?')) dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>🎮 Crafting Game</h1>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset Game
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.recipesPanel}>
          <RecipesList />
        </div>

        <div className={styles.centerPanel}>
          <CraftingArea />
        </div>

        <div className={styles.sidePanel}>
          <Inventory />
          <GarbageArea />
        </div>

        {/* DiscoveryPanel în colț dreapta sus */}
        <DiscoveryPanel />
      </main>

      <div className={styles.resourcesContainer}>
        <ResourcesBar />
        
      </div>

      {state.showVictory && (
        <div className={styles.victoryModal}>
          <h2>🎉 Felicitări! Ai creat obiectul final!</h2>
        </div>
      )}
    </div>
  );
}

export default App;
