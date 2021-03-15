import 'regenerator-runtime/runtime'
import { API_URL } from './config.js'
import { getJson } from './helpers.js'
console.log(API_URL)

export const state = {
  recipe: {},
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}`)
    let { recipe } = data.data
    state.recipe = {
      id: recipe.id,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      title: recipe.title,
    }
  } catch (err) {
    console.error(`Error in model : ${err}`)
  }
}
