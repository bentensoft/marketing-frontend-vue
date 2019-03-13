<template>
  <div class="tasks container">
    <div class="clearfix">
      <b-btn class='mb-4' variant='primary' @click='makeEmptyTask()' v-b-modal.add-task>
        <i class="fa fa-thumb-tack" aria-hidden="true">
        </i> Add task
      </b-btn>
      <b-btn class='mb-4 float-right' :disabled='isLoading' variant='primary' @click='updateTasks()'>
        <i class="fa fa-refresh" aria-hidden="true">
        </i> Refresh list
      </b-btn>
    </div>
    <b-card no-body>
    <b-tabs ref="tabs" card>
      <b-tab title="Todo" active>
        <TasksList :clientId='clientId' @updateTasks='updateTasks()' @showModalTask='showModal()' :tasks='toDoTasks'></TasksList>
      </b-tab>
      <b-tab title="Done" >
        <TasksList :clientId='clientId' @updateTasks='updateTasks()' @showModalTask='showModal()' :tasks='doneTasks'></TasksList>
      </b-tab>
    </b-tabs>
    </b-card>
    <Loader v-if='isLoading'></Loader>
    <ModalTask @close='hideModal()' :clientId='clientId' @updateTasks='updateTasks' :showModal='showModalTask'></ModalTask>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ModalTask from './TaskModal.vue';
import Loader from '../../UI/Loader.vue';
import TasksList from './TasksList.vue';

export default {
  name: 'tasks',
  data() {
    return {
      showModalTask: false,
      isLoading: true,
    };
  },
  components: {
    ModalTask,
    TasksList,
    Loader,
  },
  computed: {
    ...mapState({
      clientId({ client }) {
        if (this.$route.name !== 'Client Tasks') {
          return null;
        }
        return client ? client.urlsafe : '';
      },
      doneTasks({ tasks }) {
        return tasks.filter(t => t.done);
      },
      toDoTasks({ tasks }) {
        return tasks.filter(t => !t.done);
      },
    }),
  },
  watch: {
    clientId() {
      this.updateTasks();
    },
  },
  methods: {
    ...mapActions(['loadTasks', 'loadCurrentUser']),
    hideModal() {
      this.showModalTask = false;
    },
    showModal() {
      this.showModalTask = true;
    },
    makeEmptyTask() {
      this.$store.commit('changeTask', null);
      this.showModal();
    },
    updateTasks() {
      this.isLoading = true;
      this.loadTasks(this.clientId)
        .then(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.loadCurrentUser();
    this.updateTasks();
  },
};
</script>
