// VictoryModal.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import './VictoryModal.module.css'; // CSS module ar trebui să aibă .module.css

const VictoryModal = () => {
  const { state, dispatch } = useGame();

  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  if (!state.showVictory) return null;

  return (
    <div className="victory-modal-overlay">
      <div className="victory-modal">
        <h2>🎉 Felicitări!</h2>
        <button onClick={handleReset}>Începe jocul de la capăt</button>
      </div>
    </div>
  );
};

export default VictoryModal;
