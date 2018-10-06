/**
 * @file
 * Index file of the reducers.
 * 
 * @author Riccardo Busetti
 */
import { combineReducers } from 'redux'
import { login } from './login'

/**
 * Combines all the reducers together into a single
 * function needed by the create store.
 */
const reducers = combineReducers({
    login
})

export default reducers;