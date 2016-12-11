import React from 'react';

import { MAX_GENERATIONS, binaryRules } from '../config';

import { pad } from '../lib/util';

import Button from './Button';

// preset binary rules to display in the dropdown
const presetRules = [30, 60, 90, 50, 22, 190, 5];

const GenerationControl = ({ onChange, value }) =>
  <p className="control has-icon is-expanded">
    <input
      className="input"
      type="number"
      min="0"
      max={MAX_GENERATIONS}
      step="1"
      onChange={onChange}
      value={value}
      placeholder="number of generations"
    />
    <i className="fa fa-bars" />
  </p>
;

const RuleControl = ({ onChange, value }) =>
  <p className="control has-icon is-expanded">
    <input
      className="input"
      type="number"
      min="0"
      max="255"
      step="1"
      placeholder="rule (decimal)"
      onChange={onChange}
      value={value}
    />
    <i className="fa fa-cog" />
  </p>
;

const PresetRuleControl = ({ onChange, value }) =>
  <p className="control">
    <span className="select">
      <select onChange={onChange} value={value}>
        <option>... or presets</option>
        {presetRules.map(rule => <option key={rule} value={rule}>{rule}</option>)}
      </select>
    </span>
  </p>
;

const RandomControl = ({ onToggleRandom, random, seed }) =>
  <p className="control has-addons">
    <button className={`button ${!random && !seed && 'is-primary'}`} onClick={onToggleRandom}>
      <span className="icon"><i className="fa fa-circle" /></span>
      <span>Regular</span>
    </button>
    <button className={`button ${random && !seed && 'is-primary'}`}  onClick={onToggleRandom}>
      <span className="icon"><i className="fa fa-random" /></span>
      <span>Random</span>
    </button>
  </p>
;

const SeedControl = ({ onChange, value }) =>
  <p className="control has-icon is-expanded">
    <input onChange={onChange} value={value} placeholder="seed" className="input is-expanded" />
    <i className="fa fa-snowflake-o" />
  </p>
;

const BinaryRuleDisplay = ({ binaryRule }) =>
  <div className="columns">
    <div className="column" />
    {binaryRules.map((rule, i) =>
      <div key={rule} className="column is-1 has-text-centered">
        <span className="tag is-large is-dark">{rule}</span><br /><br />
        <input className="input has-text-centered" disabled value={parseInt(binaryRule && binaryRule[i], 2) || 0}/>
      </div>
    )}
    <div className="column" />
  </div>
;

const SettingsPanel = ({
  automataEnabled,
  onChangeGenerations,
  generations,
  onChangeDecimalRule,
  decimalRule,
  onToggleRandom,
  random,
  binaryRule,
  createAutomata,
  setDefault,
  onChangeSeed,
  seed,
}) =>
  <div className="container box" style={{ display: automataEnabled ? 'none' : 'block' }}>
    <label>Generations</label>
    <GenerationControl onChange={onChangeGenerations} value={generations} />
    <label>Rule<sub>10</sub></label>
    <span className="control is-grouped">
      <RuleControl onChange={onChangeDecimalRule} value={decimalRule} />
      <PresetRuleControl onChange={onChangeDecimalRule} value={decimalRule} />
    </span>
    <label>Initial state (options override seed)</label>
    <span className="control is-grouped">
      <SeedControl onChange={onChangeSeed} value={seed} />
      <RandomControl onToggleRandom={onToggleRandom} random={random} seed={seed} />
    </span>
    <br /><br />
    <div className="is-hidden-mobile">
      <h1 className="subtitle has-text-centered">
        Binary Representation, Rule<sub>2</sub>
      </h1>
      <BinaryRuleDisplay binaryRule={pad(binaryRule, 8)} />
    </div>
    <br />
    <div className="columns has-text-centered">
      <div className="column" />
      <div className="column">
        <Button icon="plus" func={createAutomata} disabled={!binaryRule || !generations} btnClass="is-primary is-medium">new automata</Button>
      </div>
      <div className="column">
        <Button icon="undo" func={setDefault} btnClass="is-dark is-medium">default values</Button>
      </div>
      <div className="column">
        <Button icon="random" func={() => onChangeDecimalRule({ target: { value: Math.floor(Math.random() * 255) + 1 }})} btnClass="is-info is-medium">randomise rule</Button>
      </div>
      <div className="column" />
    </div>
  </div>
;

export default SettingsPanel;
