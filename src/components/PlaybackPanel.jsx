import React from 'react';

import Button from './Button';

// speed interval options (1/1000th sec)
const speeds = [0, 25, 50, 100, 250, 500, 1000, 2000];

const PlaybackPanel = ({
  automataEnabled,
  onReset,
  onPlay,
  onPause,
  onFastForward,
  isLastGeneration,
  isActive,
  iterate,
  onChangeSpeed,
  onToggleEnabled,
  onToggleCrypto,
  visibleCrypto,
  onToggleLineDisplay,
}) =>
  <div className="container" style={{ display: automataEnabled ? 'block' : 'none'}}>
    <div className="columns is-multiline has-text-centered">
      <div className="column is-4">
        <Button btnClass="is-dark" icon="chevron-left" func={onToggleEnabled}>settings</Button>
        <Button btnClass="is-dark" icon="user-secret" func={onToggleCrypto}>{visibleCrypto ? 'hide' : 'show'} crypto</Button>
      </div>
      <div className="column is-6">
        <Button btnClass="is-dark" icon="magic" func={onToggleLineDisplay} />
        <Button btnClass="is-primary" icon="fast-backward" func={onReset}>Reset</Button>
        <Button btnClass="is-primary" icon={isActive ? 'pause' : 'play'} func={isActive ? onPause : onPlay} disabled={isLastGeneration}>{isActive ? 'Pause' : 'Play'}</Button>
        <Button btnClass="is-primary" icon="forward" func={iterate} disabled={isLastGeneration}>Step</Button>
        <Button btnClass="is-primary" icon="fast-forward" func={onFastForward} disabled={isLastGeneration}>End</Button>
      </div>
      <div className="column is-2">
        <span className="select">
          <select onChange={onChangeSpeed}>
            <option>Speed</option>
            {speeds.map(speed =>
              <option key={speed} value={speed}>{speed/1000}s/gen</option>,
            )}
          </select>
        </span>
      </div>
      <br /><br /><br /><br />
    </div>
  </div>
;

export default PlaybackPanel;
