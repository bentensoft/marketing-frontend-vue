const setVisibleUsers = (state, users) => {
  state.visibleUsers = users;
};

const setCurrentUser = (state, user) => {
  state.currentUser = user;
};

const setTasks = (state, tasks) => {
  state.tasks = tasks;
};

const setClients = (state, clients) => {
  state.clients = clients;
};

const changeEditClietnId = (state, value) => {
  state.editClientId = value;
};

const changeTask = (state, value) => {
  state.task = value;
};

const changeClient = (state, value) => {
  state.client = value;
};

export const mutations = {
  changeClient,
  changeEditClietnId,
  changeTask,
  setClients,
  setCurrentUser,
  setTasks,
  setVisibleUsers,
};
