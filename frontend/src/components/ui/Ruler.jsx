import React from 'react';

const VERTICAL_CELLS = Array.from({ length: 30 }, (_, index) => index);
const HORIZONTAL_CELLS = Array.from({ length: 50 }, (_, index) => index);

/**
 * Calibration ruler strips along the left and bottom edges of the desk.
 */
export default function Ruler() {
  return (
    <>
      <div className="ruler ruler--left">
        {VERTICAL_CELLS.map((cell) => (
          <div key={cell} className="ruler__cell--v">
            <span className="ruler__tick--v" />
            {cell > 0 && cell % 5 === 0 ? (
              <span className="ruler__label">{cell}</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="ruler ruler--bottom">
        {HORIZONTAL_CELLS.map((cell) => (
          <div key={cell} className="ruler__cell--h">
            <span className="ruler__tick--h" />
            {cell > 0 && cell % 5 === 0 ? (
              <span className="ruler__label">{cell}</span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="ruler__protractor">45°</div>
    </>
  );
}
