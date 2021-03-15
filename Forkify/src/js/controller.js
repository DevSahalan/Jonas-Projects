import * as model from './model.js'
//Views
import recipeView from './views/recipeView.js'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const recipeContainer = document.querySelector('.recipe')

// https://forkify-api.herokuapp.com/v2

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    //Load spinner
    recipeView.renderSpinner()
    //Load recipe
    await model.loadRecipe(id)
    const { recipe } = model.state
    //rendering recipe
    recipeView.render(recipe)
  } catch (err) {
    console.error(`Error from controller: ${err}`)
  }
}

const eveArr = ['hashchange', 'load']
eveArr.forEach((eve) => window.addEventListener(eve, showRecipe))
