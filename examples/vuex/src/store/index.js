import { createStore } from 'vuex'
import { state, mutations, getters } from './mutations'

export default createStore({
	state,
	getters,
	mutations
})
