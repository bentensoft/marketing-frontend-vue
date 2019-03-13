<template>
  <div class='mt-4'>
    <b-row class='head text-center'>
      <b-col :cols='largeColumnWidth'>Title</b-col>
      <b-col :cols='largeColumnWidth'>Description</b-col>
      <b-col cols='2'>Due date</b-col>
      <b-col cols='2' v-if='showClientColumn'>Client</b-col>
      <b-col cols='2'>Assignee</b-col>
      <b-col cols='2'>Watchers</b-col>
    </b-row>
    <b-row class='mb-1 mt-1' v-for='(task, index) in tasks' :key="task.id">
      <b-col :cols='largeColumnWidth' class='name'>
        <b-form-checkbox plain @change='changeTaskStatus(index)' :class="task.done ? 'done' : ''" :checked='task.done' class="task-title">
          {{task.title}}
        </b-form-checkbox>
        <b-button class='edit-btn' v-b-modal.add-task @click='changeTaskInStore(index)' size='sm' variant='link'>
          <i class="fa fa-pencil" aria-hidden="true"></i></b-button>
      </b-col>
      <b-col :cols='largeColumnWidth' class='text-center'>
        {{task.description}}
      </b-col>
      <b-col cols='2' :class='checkDateOvervdue(task.due)' class='text-center'>
        {{formatDueDate(task.due)}}
      </b-col>
      <b-col cols='2' class='text-center' v-if='showClientColumn'>
        <router-link v-if='taskClient(task).id' :to='{name: "Client Main", params: {id: taskClient(task).customer_id}}'>
          {{taskClient(task).name}}
        </router-link>
      </b-col>
      <b-col cols='2' class='text-center'>
        <img class="avatar mr-2" :src="taskAssignee(task).avatar" alt="">
        {{toUsername(taskAssignee(task))}}
      </b-col>
      <b-col cols='2' class='text-center'>
        <div v-for='watcher in task.watchers'>
          <img class="avatar mr-2" :src="watcher.avatar" alt="">
          {{toUsername(watcher)}}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'task-list',
  props: ['tasks', 'clientId'],
  data() {
    return {};
  },
  computed: {
    largeColumnWidth() {
      return this.showClientColumn ? 2 : 3;
    },
    showClientColumn() {
      return !this.clientId;
    },
  },
  methods: {
    ...mapActions(['toggleTask']),
    toUsername(user) {
      const { first_name: fn = '', last_name: ln = '' } = user;
      return (fn || ln) ? `${fn} ${ln}` : 'Unknown';
    },
    taskClient(task) {
      return task.client ? task.client : {};
    },
    taskAssignee(task) {
      return task.assignee ? task.assignee : {};
    },
    checkDateOvervdue(date) {
      const now = (new Date().toISOString()).slice(0, 10);
      const dueDate = (new Date(date).toISOString()).slice(0, 10);
      if (now === dueDate) {
        return 'text-warning';
      } else if (now > dueDate) {
        return 'text-danger';
      }
      return '';
    },
    changeTaskInStore(ind) {
      this.$store.commit('changeTask', this.tasks[ind]);
      this.$emit('showModalTask');
    },
    formatDueDate(due) {
      if (!due) {
        return '';
      }
      const day = due.slice(8, 10);
      const month = due.slice(5, 7);
      const year = due.slice(0, 4);
      return `${day}.${month}.${year}`;
    },
    changeTaskStatus(index) {
      const task = this.tasks[index];
      const done = !task.done;
      task.done = done;

      this.toggleTask(task.urlsafe)
        .then(() => {
          this.$emit('updateTasks');
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head {
  font-weight: bold;
}

.comment-btn{
  position: relative;
}

.count{
  position: absolute;
  top: -10px;
  left: 20px;
  padding: 0 2px;
  text-align: center;
}

.done {
  color: #ccc;
  text-decoration: line-through;
}

.done:hover {
  color: #999;
}

.task-title {
  display: inline-block;
}

.edit-btn {
  cursor: pointer;
  opacity: 0;
  transition: .2s;
  padding-top: 0;
  padding-bottom: 0;
}

.name:hover .edit-btn {
  opacity: 1;
}
</style>
