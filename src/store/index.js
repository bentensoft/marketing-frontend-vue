import Vue from 'vue';
import Vuex from 'vuex';
import { userToken } from '../services/auth';
import { mutations } from './mutations';
import { actions } from './actions';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    editClientId: null,
    task: null,
    client: {
      id: null,
      is_custom: false,
    },
    isSignIn: !!userToken(),
    userToken: userToken(),
    currentUser: null,
    clients: [],
    visibleUsers: [],
    tasks: [],
  },
  actions,
  mutations,
});
