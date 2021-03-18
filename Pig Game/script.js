'use strict'
// selecting elements
const score0El = document.querySelector('#score--0')
const score1El = document.querySelector('#score--1')
const diceEl = document.querySelector('.dice')
const btnNew = document.querySelector('.btn--new')
const btnRoll = document.querySelector('.btn--roll')
const btnHold = document.querySelector('.btn--hold')
const current0El = document.querySelector('#current--0')
const current1El = document.querySelector('#current--1')
const player0El = document.querySelector('.player--0')
const player1El = document.querySelector('.player--1')

let currentScore, activePlayer, score, playing

const init = () => {
  score0El.textContent = 0
  score1El.textContent = 0
  current0El.textContent = 0
  current1El.textContent = 0
  diceEl.classList.add('hidden')
  player0El.classList.add('player--active')
  player0El.classList.remove('player--winner')
  player1El.classList.remove('player--active')
  player1El.classList.remove('player--winner')
  activePlayer = 0
  currentScore = 0
  score = [0, 0]
  playing = true
}
init()
// Switch player
const switchPlayer = () => {
  currentScore = 0
  document.querySelector(`#current--${activePlayer}`).textContent = 0
  activePlayer = activePlayer === 0 ? 1 : 0
  player0El.classList.toggle('player--active')
  player1El.classList.toggle('player--active')
}
// rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1.generate random number
    const dice = Math.trunc(Math.random() * 6) + 1
    console.log(dice)
    // display dice

    diceEl.classList.remove('hidden')
    diceEl.src = `dice-${dice}.png`

    // check for rolled 1
    if (dice !== 1) {
      // add dice to current score
      currentScore += dice
      document.querySelector(
        `#current--${activePlayer}`
      ).textContent = currentScore
      // current0El.textContent = currentScore
    } else {
      // switch player
      switchPlayer()
    }
  }
})

btnHold.addEventListener('click', function () {
  if (playing) {
    score[activePlayer] += currentScore
    document.querySelector(`#score--${activePlayer}`).textContent =
      score[activePlayer]
    if (score[activePlayer] >= 100) {
      playing = false
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active')
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner')
      diceEl.classList.add('hidden')
    } else {
      switchPlayer()
    }
  }
})

btnNew.addEventListener('click', init)
