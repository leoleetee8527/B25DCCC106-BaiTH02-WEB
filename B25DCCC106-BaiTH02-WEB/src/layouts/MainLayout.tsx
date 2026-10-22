import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { TemperatureUnit, LayoutContextType } from '../types';

function MainLayout() {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [background, setBackground] = useState<string>(
    'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  );

  const contextValue: LayoutContextType = {
    unit,
    setUnit,
    background,
    setBackground,
  };

  return (
    <div className="layout" style={{ background }}>
      <header className="layout__header">
        <div className="layout__brand">
          <span className="layout__logo">🌤️</span>
          <h1 className="layout__title">Thời tiết Việt Nam</h1>
        </div>

        <div className="unit-toggle">
          <button
            type="button"
            className={`unit-toggle__btn ${unit === 'C' ? 'unit-toggle__btn--active' : ''}`}
            onClick={() => setUnit('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-toggle__btn ${unit === 'F' ? 'unit-toggle__btn--active' : ''}`}
            onClick={() => setUnit('F')}
          >
            °F
          </button>
        </div>
      </header>

      <main className="layout__main">
        <Outlet context={contextValue} />
      </main>

      <footer className="layout__footer">
        <p>Lê Hùng Hậu - B25DCCC106 - Bài thực hành 02</p>
      </footer>
    </div>
  );
}

export default MainLayout;
