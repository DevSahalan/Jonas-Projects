'use strict'

const form = document.querySelector('.form')
const containerWorkouts = document.querySelector('.workouts')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('.form__input--distance')
const inputDuration = document.querySelector('.form__input--duration')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')

class Workout {
  date = new Date()
  id = (Date.now() + '').slice(-10)
  constructor(coords, distance, duration) {
    this.coords = coords // [lat, lng]
    this.distance = distance //km
    this.duration = duration //min
  }
  _setDescription() {
    // Running on february 10
    console.log(this.type)
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ]
    this.description = ` ${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = 'running'
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calPace()
    this._setDescription()
  }
  calPace() {
    // min / km
    this.pace = this.duration / this.distance
  }
}

class Cycling extends Workout {
  type = 'cycling'
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration)
    this.elevationGain = elevationGain
    this.speed = this.distance / (this.duration / 60) // km / hour
    this._setDescription()
  }
}

class App {
  #map
  #mapEvent
  #workouts = []
  constructor() {
    // get position
    this._getPosition()

    // get workouts from localstorage
    this._getLocalStorage()
    //add eventlistener
    form.addEventListener('submit', this._newWorkout.bind(this))

    inputType.addEventListener('change', this._toggleElevationField)
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this))
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout')
    if (!workoutEl) return
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    )
    console.log(workout)
    console.log(workout.coords)
    this.#map.setView(workout.coords, 17, {
      animate: true,
      pan: {
        duration: 1,
      },
    })
  }
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert(`Couldnt get the location`)
      })
  }
  _loadMap(position) {
    const { latitude, longitude } = position.coords
    const mapLink = `https://www.google.com/maps/@${latitude},${longitude}`
    const coords = [latitude, longitude]
    this.#map = L.map('map').setView(coords, 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map)

    //handling clicks on map
    this.#map.addEventListener('click', this._showForm.bind(this))
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work)
    })
  }
  _showForm(mapE) {
    this.#mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
  }
  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  }
  _newWorkout(e) {
    e.preventDefault()
    //input validations helper functions
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every((input) => input > 0)
    // get data from form
    const type = inputType.value
    const duration = +inputDuration.value
    const distance = +inputDistance.value
    const { lat, lng } = this.#mapEvent.latlng
    let workout
    // check if data is valid

    //if running workout then create running object
    if (type === 'running') {
      const cadence = +inputCadence.value
      if (
        !validInputs(duration, distance, cadence) ||
        !allPositive(duration, distance, cadence)
      )
        return alert(`all inputs must be positive number`)
      workout = new Running([lat, lng], distance, duration, cadence)
    }
    //if cycling workout then create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value
      if (
        !validInputs(duration, distance, elevation) ||
        !allPositive(duration, distance)
      )
        return alert(`all inputs must be positive number`)
      workout = new Cycling([lat, lng], distance, duration, elevation)
    }
    //add new object to workout array
    console.log(workout)
    this.#workouts.push(workout)
    //render workout on map as marker
    this._renderWorkoutMarker(workout)

    //render workout on  list
    this._renderWorkoutToList(workout)
    //hide form + clear input fields
    this._hideForm()

    // set workouts to local storage
    this._setLocalStorage()
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts))
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'))
    this.#workouts = data
    this.#workouts.forEach((work) => {
      this._renderWorkoutToList(work)
    })
  }
  _hideForm() {
    // empty inputs
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      ''
    // hide form
    form.style.display = 'none'
    form.classList.add('hidden')
    setTimeout(() => {
      form.style.display = 'grid'
    }, 1000)
  }
  // render workout to list
  _renderWorkoutToList(workout) {
    let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
    `
    if (workout.type === 'running')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
     `

    if (workout.type === 'cycling')
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li> 
     `
    form.insertAdjacentHTML('afterend', html)
  }
  // render workout marker to map
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup()
  }
}

const app = new App()
