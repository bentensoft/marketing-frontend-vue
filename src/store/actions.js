import Vue from 'vue';
import { configWithCredentials } from '../services/auth';
import { newApiProperty } from '../services/urlConfig';

const loadClients = ({ commit }) => Vue.axios({
  method: 'get',
  url: `${newApiProperty}/api/clients`,
}, configWithCredentials()).then((resp) => {
  const clients = resp.data.data;
  commit('setClients', clients);
}).catch((error) => {
  console.error(error.response);
});

const loadCurrentUser = ({ commit }) => Vue.axios({
  method: 'get',
  url: `${newApiProperty}/api/users/current`,
}, configWithCredentials()).then((resp) => {
  const user = resp.data;
  commit('setCurrentUser', user);
}).catch((error) => {
  console.error(error.response);
});

const loadVisibleUsers = ({ commit }) => Vue.axios({
  method: 'get',
  url: `${newApiProperty}/api/users/visible`,
}, configWithCredentials()).then((resp) => {
  const users = resp.data;
  commit('setVisibleUsers', users);
}).catch((error) => {
  console.error(error.response);
});

const toggleTask = (context, taskId) => Vue.axios({
  method: 'put',
  url: `${newApiProperty}/api/tasks/toggle/${taskId}`,
}, configWithCredentials()).catch((error) => {
  console.error(error.response);
});

const loadTasks = ({ commit }, clientId) => {
  const url = clientId ? `/api/tasks/client/${clientId}` : '/api/tasks/';
  return Vue.axios({
    method: 'get',
    url: `${newApiProperty}${url}`,
  }, configWithCredentials()).then((resp) => {
    const tasks = resp.data;
    commit('setTasks', tasks);
  }).catch((error) => {
    console.error(error.response);
  });
};

export const actions = {
  loadClients,
  loadCurrentUser,
  loadTasks,
  loadVisibleUsers,
  toggleTask,
};
