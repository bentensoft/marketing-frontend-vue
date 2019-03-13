<template>
  <b-modal hide-footer hide-header v-model="modalVisible" @shown='prepareModal' @hidden='close' id='add-task' ref='addTask'>
    <b-form-group class='clearfix'>
      <label>Title</label>
      <b-button-close @click='close'></b-button-close>
      <b-form-input v-model='title' ref='autofocus'></b-form-input>
    </b-form-group>
    <label>Description</label>
    <b-form-textarea :rows='2' :max-rows='2' v-model='description'></b-form-textarea>
    <b-form-group>
      <label>Due date</label>
      <datepicker :typeable='true' :bootstrap-styling='true' v-model='due' format='MM/dd/yyyy'></datepicker>
    </b-form-group>
    <b-form-group v-if='!clientId'>
      <label>Client</label>
      <v-select class='mb-2' v-model="client" :options='clients'></v-select>
    </b-form-group>
    <b-form-group>
      <label>Assignee</label>
      <v-select class='mb-2' v-model="assignee" :options='users'></v-select>
    </b-form-group>
    <label>Watchers</label>
    <v-select class='mb-2' multiple v-model="watcher" :closeOnSelect='true' :options='users'></v-select>
    <b-btn class="mt-3 update-task" variant='success' block @click="updateTask">
      {{isEmptyTask ? 'Add' : 'Change'}} task
    </b-btn>
    <div class='clearfix mt-3'>
      <b-link variant="danger" class='float-left text-danger' v-if='!isEmptyTask' @click="deleteTask">
        <i class="fa fa-trash" aria-hidden="true"></i>
        <u>Delete</u>
      </b-link>
      <b-link @click='close' class='float-right text-secondary'><u>Close</u></b-link>
    </div>
  </b-modal>
</template>

<script>
import vSelect from 'vue-select';
import Datepicker from 'vuejs-datepicker';
import { mapActions, mapState } from 'vuex';


const userToSelection = (user) => {
  const {
    first_name: fn, last_name: ln,
    last_seen_email: email, urlsafe,
  } = user;
  return {
    label: `${fn} ${ln} (${email})`,
    value: urlsafe,
  };
};


const clientToSelection = (client) => {
  const {
    urlsafe, name, id,
    customer_id: customerId,
  } = client;
  return {
    label: `${name || customerId || id}`,
    value: urlsafe,
  };
};

const dateToDue = (date) => {
  if (!date) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

export default {
  name: 'modal-task',
  props: ['showModal', 'clientId'],

  data() {
    return {
      urlsafe: null,
      modalVisible: this.showModal,
      title: null,
      description: null,
      due: null,
      watcher: [],
      assignee: null,
      client: null,
    };
  },

  components: {
    vSelect,
    Datepicker,
  },

  computed: {
    isEmptyTask() {
      return this.$store.state.task === null;
    },
    ...mapState({
      task: state => state.task,
      users: ({ visibleUsers }) => visibleUsers.map(userToSelection),
      clients: ({ clients }) => clients.map(clientToSelection),
      currentUser: 'currentUser',
    }),
    selectedAssigneeId() {
      const { assignee } = this;
      return assignee ? assignee.value : null;
    },
    selectedClientId() {
      const {
        client: selectedClient,
        clientId,
      } = this;
      const selectedClientId = selectedClient ? selectedClient.value : null;
      const id = clientId || selectedClientId;
      return id;
    },
  },

  methods: {
    ...mapActions(['loadClients', 'loadVisibleUsers']),
    close() {
      this.clearState();
      this.$refs.addTask.hide();
      this.$emit('close');
    },
    deleteTask() {
      this.axios({
        method: 'delete',
        url: `${this.newApiProperty}/api/tasks/${this.$store.state.task.urlsafe}`,
      }, this.configWithCredentials).then(() => {
        this.$refs.addTask.hide();
        this.$emit('updateTasks');
      }).catch((error) => {
        console.error(error.response);
      });
    },
    updateTask() {
      const {
        due, title, description, urlsafe,
        selectedAssigneeId, selectedClientId,
        watcher,
      } = this;
      const watchers = watcher.map(w => w.value);
      this.axios({
        method: 'post',
        url: `${this.newApiProperty}/api/tasks/`,
        data: {
          urlsafe,
          title,
          description,
          assignee: selectedAssigneeId,
          client: selectedClientId,
          watchers,
          due: dateToDue(due),
        },
      }, this.configWithCredentials).then(() => {
        this.$refs.addTask.hide();
        this.$emit('updateTasks');
      }).catch((error) => {
        console.error(error.response);
      });
    },
    clearState() {
      this.title = null;
      this.description = null;
      this.urlsafe = null;
      this.assignee = null;
      this.client = null;
      this.watcher = [];
      this.due = null;
    },
    prepareModal() {
      this.loadClients();
      this.loadVisibleUsers();
      this.due = new Date();
      this.$refs.autofocus.focus();
      const { currentUser } = this;
      this.watcher = [userToSelection(currentUser)];

      if (this.task) {
        const {
          title, assignee, client, watchers,
          urlsafe, due, description,
        } = this.task;

        this.title = title;
        this.urlsafe = urlsafe;
        this.description = description;
        if (assignee) {
          this.assignee = userToSelection(assignee);
        }
        if (client) {
          this.client = clientToSelection(client);
        }
        this.watcher = watchers.map(userToSelection);
        this.due = new Date(due);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.update-task {
  font-size: 20px;
}
</style>
