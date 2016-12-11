import { pad } from './util';

import { binaryRules } from '../config';

class AutomataIterator {
  /**
  * @param {String} rule - 8 bit binary String
  * @param {Int} generations - Number of generations to produce
  * @param {Boolean} randomState - Generate random initial state or single center state
  * @param {Uint8Array} state - Override generated state
  */
  constructor(rule, generations, randomState, state) {
    const ruleArray = pad(rule, 8).split('');
    const rules = {};
    binaryRules.forEach((val, i) => {
      // parse binary rules array and rule parameter into { neighborhood: result } object mapping
      rules[val] = parseInt(ruleArray[i], 2);
    });
    this.rules = rules;
    this.generations = generations;
    this.currentGeneration = 1;
    if (state) {
      // max columns based on number of generations and initial state
      this.columns = state.length + 2*generations - 3;
      // set the given state into the centre of the max columns-wide array
      this.currentState = [...new Uint8Array(parseInt(generations, 10)-2), ...state, ...new Uint8Array(parseInt(generations, 10)-1)];
    } else {
      // max columns based on middle index being 1, rest 0
      this.columns = 2*this.generations - 1;
      // central index
      this.middleI = Math.floor(this.columns/2);
      let genState = new Uint8Array(this.columns);
      if(randomState) {
        // set random binary values to each index
        genState = genState.map(() => ((Math.random() >= 0.5) ? 1 : 0))
      } else {
        // set the middle index
        genState[this.middleI] = 1;
      }
      this.currentState = genState;
    }
  }
  nextAutomata() {
    // for each index, return the this.rules[neighbourhood] value
    return this.currentState.map(
      (val, i) => this.rules[
        [this.currentState[i-1] || 0, val, this.currentState[i+1] || 0].join('')
      ]
    );
  }
  next() {
    this.currentGeneration++;
    this.currentState = this.nextAutomata();
    return this.currentState;
  }
}

export default AutomataIterator;
