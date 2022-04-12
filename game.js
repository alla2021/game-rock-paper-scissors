var crypto = require('crypto');
var randomize = require('randomatic');
const { argv } = require('process');
const menu = `1 - rock 
2 - paper 
3 - scissors
4 - lizard
5 - spock
0 - exit
? - help
Enter your move:`;
const errorMessage = `Wrong input! Enter 1,2,3,4,5,0,?`;
const chooseTable = {
  1: 'rock',
  2: 'paper',
  3: 'scissors',
  4: 'lizard',
  5: 'spock',
};
let readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

class HmacKey {
  constructor() {
    let source = randomize('Aa0!', 64);
    this.value = Buffer.from(source).toString('hex');
  }
}

class Hmac {
  constructor(value) {
    this.key = new HmacKey();
    this.value = crypto
      .createHmac('SHA3-256', this.key.value)
      .update(value + '')
      .digest('hex');
  }
}

class Computer {
  #max = 5;
  #min = 1;
  constructor() {
    this.MakeChoise();
  }
  MakeChoise() {
    this.choise =
      Math.floor(Math.random() * (this.#max - this.#min + 1)) + this.#min;
    this.hmac = new Hmac(this.choise);
  }
}

let computePlayer = new Computer();

class Game {
  static Compare(a, b) {
    let difference = a - b;
    if (Math.abs(difference) >= 3) {
      if (difference > 0) {
        return 1;
      }
      return -1;
    }
    if (difference < 0) {
      return 1;
    }
    if (difference > 0) {
      return -1;
    }
    return 0;
  }
}

class Help {
  #helpResultTab = {
    1: 'Lose',
    '-1': 'Win',
    0: 'Draw',
  };

  CallHelp() {
    let formatedTable = {};
    for (const a in chooseTable) {
      formatedTable[chooseTable[a]] = {};
      for (const user in chooseTable) {
        let result = Game.Compare(a, user);
        formatedTable[chooseTable[a]][chooseTable[user]] =
          this.#helpResultTab[result];
      }
    }
    console.log('rows player ||| columns computer');
    console.table(formatedTable);
  }
}

class Messages {
  static #userWinMessage = 'You win!';
  static #CompWinMessage = 'Computer win!';
  static #drawMessage = 'Draw! Thre is no winner';
  static #help = new Help();
  static PrintWinner(user, computer) {
    let result = Game.Compare(user, computer);
    if (result === -1) {
      console.log(this.#userWinMessage);
    }
    if (result === 1) {
      console.log(this.#CompWinMessage);
    }
    if (result === 0) {
      console.log(this.#drawMessage);
    }
  }

  static PrintComputerHMAC() {
    console.log('HMAC: ' + computePlayer.hmac.value);
  }

  static PrintComputerKey() {
    console.log('HMAC Key: ' + computePlayer.hmac.key.value);
  }

  static PrintGameResult(computerStep, userChoose) {
    console.log('Computer move: ' + chooseTable[computerStep]);
    console.log('Your move: ' + chooseTable[userChoose]);
    this.PrintWinner(userChoose, computerStep);
    this.PrintComputerKey();
  }

  static PrintHelp() {
    this.#help.CallHelp();
  }

  static PrintMenu() {
    console.log(menu);
  }

  static PrintError() {
    console.log(errorMessage);
  }

  static PrintGameStart() {
    console.log('Task 3');
    computePlayer.MakeChoise();
    this.PrintComputerHMAC();
    this.PrintMenu();
  }

  static ProcessGameInput(userInput) {
    this.process = require('process');
    if (userInput === '0') {
      readline.close();
      return;
    }
    if (userInput === '?') {
      Messages.PrintHelp();
      return;
    }
    let userChoose = '';
    for (const el in chooseTable) {
      if (userInput === el || userInput === chooseTable[el]) {
        userChoose = el;
        break;
      }
    }
    if (userChoose === '') {
      Messages.PrintError();
      return;
    }
    this.PrintGameResult(computePlayer.choise, userChoose);
    computePlayer.MakeChoise();
  }
}
doublicat(process.argv);
function doublicat() {
  const uniq = [...new Set(process.argv)];
  if (process.argv.length !== uniq.length) {
    console.log('Reiteration!Use arguments only once');
    readline.close();
    process.exit();
  }
}

if (process.argv.length === 2) {
  console.log('Wrong! Empty');
  readline.close();
  process.exit();
}
if (process.argv.length >= 5) {
  if (process.argv.length % 2 === 0) {
    console.log('Wrong! Enter a number from arguments');
    readline.close();
    process.exit();
  }
  for (let i = 2; i < process.argv.length; i++) {
    console.log('Game', i - 1);
    Messages.PrintComputerHMAC();
    Messages.ProcessGameInput(process.argv[i]);
    readline.close();
  }
} else {
  readline.on('line', (userInput) => {
    Messages.ProcessGameInput(userInput);
    Messages.PrintComputerHMAC();
    Messages.PrintMenu();
  });
  Messages.PrintGameStart();
}
