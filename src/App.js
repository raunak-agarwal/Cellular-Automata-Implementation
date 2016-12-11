import React from 'react';
import sprint from 'sprint-js';

import './App.css';
import 'bulma/css/bulma.css';

import { dec2bin, ascii2bin } from './lib/util';
import AutomataIterator from './lib/AutomataIterator';

import SettingsPanel from './components/SettingsPanel';
import PlaybackPanel from './components/PlaybackPanel';

import { MAX_GENERATIONS } from './config';

let gridElement;
const reusableContainer = document.createElement('div');

document.addEventListener('DOMContentLoaded', function(){
    gridElement = document.getElementById('grid');
}, false);

/** Generic Components **/

const HeaderAndProgress = ({ currentGeneration, generations, componentRefreshRand }) =>
  <div className="hero is-primary is-bold" style={{ marginBottom: 20 }}>
    <div className="hero-body">
      <div className="container">
        <h1 className="title">
          <i className="fa fa-cube" aria-hidden="true" /> Elementary Cellular Automata in 1 Dimension
          <span style={{ display: 'none' }}>{componentRefreshRand}</span>
        </h1>
        { currentGeneration > 0 && <progress className="progress is-large is-light" width="100%" value={currentGeneration} max={generations}></progress>}
      </div>
    </div>
  </div>
;

const Display = ({ automataEnabled }) =>
  <div className="box" style={{ marginLeft: 25, marginRight: 25, display: automataEnabled ? 'block' : 'none' }}>
    <div style={{ fontSize: 0 }} id="grid" />
  </div>
;

const Crypto = ({ initialState, lastState, visibleCrypto }) =>
  <pre
    className="container box has-text-centered"
    style={{ textAlign: 'left', background: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-all', display: visibleCrypto ? 'block' : 'none' }}
  >
    {JSON.stringify({
      instructions: [
        'You can use these values to generate a ciphered text with XOR (^)',
        'a(c) = a(0) ^ a(k)',
        'It can be deciphered using',
        'a(0) = a(c) ^ a(k)',
        'https://xor.pw/'
      ],
      'a(0)': initialState,
      'a(k)': lastState,
    }, null, 2)}
  </pre>
;

const Diag = ({ automataState, visibleDiag }) =>
  <pre className="container box has-text-centered" style={{ display: visibleDiag ? 'block' : 'none', textAlign: 'left', background: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
    {JSON.stringify(automataState, (k, v) => (v instanceof Uint8Array || v instanceof Array) ? v.join('') : v, 2)}
  </pre>
;


const Footer = ({ onToggleDiag, automataEnabled }) =>
  <footer className="footer" style={{ display: automataEnabled ? 'none' : 'block' }}>
    <div className="container">
      <div className="content has-text-centered">
        <p>
          <i className="fa fa-code" /><br />
          built with <strong>es6</strong>, <strong>react</strong>, <strong>bulma</strong> &amp; <strong>fontawesome</strong><br />
          <a href="http://nihalgonsalv.es/">nihalgonsalv.es</a> - <a onClick={onToggleDiag}>debug</a>
        </p>
      </div>
    </div>
  </footer>
;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      speed: 500,
      visibleCrypto: false,
      visibleDiag: false,
      displayLines: true,
      componentRefreshRand: undefined,
    }
  }

  clearAutomata = () => {
    this.setState({ lastState: undefined, automata: undefined });
    sprint('#grid').html('');
  }

  updateAutomata = () => {
    this.clearAutomata();
    const { binaryRule, generations, random, initialState } = this.state;
    const automata = new AutomataIterator(
      binaryRule,
      generations,
      random,
      initialState,
    );
    const cellWidth = 100/automata.columns;
    this.setState({
      automata,
      cellWidth,
      cellOn: `<img style="width:${cellWidth}%" src="./black.png" />`,
      cellOff: `<img style="width:${cellWidth}%; visibility:hidden" />`,
    });
  }

  createAutomata = () => {
    this.updateAutomata();
    this.setState({
      automataEnabled: true,
    });
  }

  setDefault = () => {
    const decimalRule = 90;
    this.setState({
      decimalRule,
      binaryRule: dec2bin(decimalRule),
      generations: 50,
      random: false,
    });
  }

  onToggleRandom = () => {
    this.setState({ random: !this.state.random, seed: undefined, initialState: undefined });
  }

  onToggleEnabled = () => {
    this.setState({ automataEnabled: !this.state.automataEnabled });
  }

  onToggleCrypto = () => {
    this.setState({ visibleCrypto: !this.state.visibleCrypto });
  }

  onToggleDiag = () => {
    this.setState({ visibleDiag: !this.state.visibleDiag });
  }

  onToggleLineDisplay = () => {
    this.setState({ displayLines: !this.state.displayLines });
  }

  onChangeGenerations = (event) => {
    let generations = event.target.value;
    if (generations > MAX_GENERATIONS) {
      generations = MAX_GENERATIONS;
    }
    this.setState({ generations });
  }

  onChangeDecimalRule = (event) => {
    let decimalRule = event.target.value;
    if (decimalRule > 255) {
      decimalRule = 255;
    } else if (decimalRule < 0) {
      decimalRule = 0;
    }
    this.setState({
      decimalRule,
      binaryRule: decimalRule ? dec2bin(decimalRule) : undefined,
    });
  }

  onChangeSeed = (event) => {
    const seed = event.target.value;
    if (!seed) {
      this.setState({ initialState: undefined, seed: undefined });
      return;
    }
    const initialStateStringArray = ascii2bin(seed).split('');
    const initialState = new Uint8Array(initialStateStringArray.length);
    initialStateStringArray.forEach((val, i) => {
      initialState[i] = val;
    });
    this.setState({
      seed,
      initialState,
    });
  }

  onChangeSpeed = (event) => {
    this.setState({ speed: event.target.value });
  }

  onReset = () => {
    this.updateAutomata();
  }

  onPlay = () => {
    if (this.state.interval) {
      this.onPause();
    }
    this.setState({
      interval: setInterval(() => { this.iterate() }, this.state.speed),
      refreshInterval: setInterval(() => {
        this.setState({ componentRefreshRand: Math.random() });
      }, 500),
    });
  }

  onPause = () => {
    clearInterval(this.state.interval);
    clearInterval(this.state.refreshInterval);
    this.setState({ interval: undefined, refreshInterval: undefined });
  }

  onFastForward = () => {
    this.onPause();
    this.setState({ speed: 100 });
    setTimeout(() => { this.onPlay() }, 5);
  }

  iterate = () => {
    const {
      automata: { currentGeneration, generations, currentState, columns },
      cellOn,
      cellOff,
      displayLines,
    } = this.state;

    const currentGenerationInt = parseInt(currentGeneration, 10);
    const generationsInt = parseInt(generations, 10);

    if (currentGenerationInt === generationsInt) {
      this.setState({
        lastState: currentState,
      });
    } else if((currentGenerationInt - 1) === generationsInt) {
      this.onPause();
      return;
    }

    const cells = ['<span>'];
    for(let i = 0; i < columns; i++) {
      cells.push(currentState[i] ? cellOn : cellOff);
    }
    cells.push('<br /></span>');

    if (displayLines) {
      reusableContainer.innerHTML = cells.join('');
      gridElement.appendChild(reusableContainer.firstChild);
    } else {
      gridElement.innerHTML = cells.join('');
    }

    this.state.automata.next();
  }

  render() {
    const {
      state: {
        visibleCrypto,
        visibleDiag,
        binaryRule,
        decimalRule,
        generations,
        random,
        seed,
        initialState,
        lastState,
        automataEnabled,
        componentRefreshRand,
        interval,
      },
      iterate,
      onToggleEnabled,
      onToggleCrypto,
      onToggleDiag,
      onToggleRandom,
      onToggleLineDisplay,
      onChangeDecimalRule,
      onChangeGenerations,
      onChangeSeed,
      onChangeSpeed,
      onReset,
      onPlay,
      onPause,
      onFastForward,
      createAutomata,
      setDefault,
    } = this;
    return <div>
       <HeaderAndProgress
         currentGeneration={this.state.automata && this.state.automata.currentGeneration}
         generations={generations}
         componentRefreshRand={componentRefreshRand}
       />
      <Diag automataState={this.state} visibleDiag={visibleDiag}/>
      <SettingsPanel
        automataEnabled={automataEnabled}
        onChangeGenerations={onChangeGenerations}
        generations={generations}
        onChangeDecimalRule={onChangeDecimalRule}
        decimalRule={decimalRule}
        binaryRule={binaryRule}
        onToggleRandom={onToggleRandom}
        random={random}
        createAutomata={createAutomata}
        setDefault={setDefault}
        onChangeSeed={onChangeSeed}
        seed={seed}
      />
      <br />
      <PlaybackPanel
        onToggleLineDisplay={onToggleLineDisplay}
        onToggleEnabled={onToggleEnabled}
        onToggleCrypto={onToggleCrypto}
        visibleCrypto={visibleCrypto}
        automataEnabled={automataEnabled}
        onReset={onReset}
        onPlay={onPlay}
        onPause={onPause}
        onFastForward={onFastForward}
        isLastGeneration={this.state.automata ? (parseInt(this.state.automata.currentGeneration - 1, 10) === parseInt(generations, 10)) : false}
        isActive={interval}
        iterate={iterate}
        onChangeSpeed={onChangeSpeed}
      />
      <Display automataEnabled={automataEnabled} />
      <Crypto
        initialState={initialState ? initialState.join('') : undefined}
        lastState={lastState ? lastState.join('') : undefined}
        visibleCrypto={visibleCrypto}
      />
    <Footer onToggleDiag={onToggleDiag} automataEnabled={automataEnabled} />
    </div>
  }
}

export default App;
