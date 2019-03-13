<template>
  <b-modal hide-footer @hidden="close" id='add-task-comment' ref='addTaskComment'>
    <h5 class="mb-4">{{task.name}}</h5>
    <div v-for='comment in task.comments' class="comment mb-3 mt-3">
      <p class="small"><img :src="comment.author.avatar" alt="" class="avatar mr-3"><b>{{comment.author.username}}</b> <i>{{comment.created.slice(8, 10)}} {{monthInText(comment.created.slice(5, 7)-1)}} {{comment.created.slice(11, 16)}}</i></p>
      <p>{{comment.text}}</p>
    </div>
    <b-form-textarea v-model='comment' :rows='2' :max-rows='2'></b-form-textarea>
    <b-btn class="mt-3" variant="success" block @click="addComment">Add comment</b-btn>
    <b-btn class="mt-3" variant="outline-danger" block @click="close">Close</b-btn>
  </b-modal>
</template>

<script>
export default {
  name: 'modal-task-comment',
  data() {
    return {
      comment: '',
    };
  },
  computed: {
    task() {
      return this.$store.state.task;
    },
  },
  methods: {
    close() {
      this.$refs.addTaskComment.hide();
      this.$emit('close');
    },
    monthInText(val) {
      if (val === 0) {
        return 'January';
      } else if (val === 1) {
        return 'February';
      } else if (val === 2) {
        return 'March';
      } else if (val === 3) {
        return 'April';
      } else if (val === 4) {
        return 'May';
      } else if (val === 5) {
        return 'June';
      } else if (val === 6) {
        return 'July';
      } else if (val === 7) {
        return 'August';
      } else if (val === 8) {
        return 'September';
      } else if (val === 9) {
        return 'October';
      } else if (val === 10) {
        return 'November';
      } else if (val === 11) {
        return 'December';
      }
      return 'Unknown';
    },
    addComment() {
      this.axios({
        method: 'post',
        url: '/tasks/comment/',
        headers: {
          Authorization: `Token ${this.$store.state.userToken}`,
        },
        data: {
          text: this.comment,
          task: this.task.id,
        },
      }).then(() => {
        this.comment = '';
        const url = this.$route.name === 'Client Tasks' ? `/clients/${this.$route.params.id}/tasks/` : '/tasks/';
        this.axios({
          method: 'get',
          url: `${url}${this.$store.state.task.id}/`,
          headers: {
            Authorization: `Token ${this.$store.state.userToken}`,
          },
        }).then((resp) => {
          this.$store.commit('changeTask', resp.data);
        }).catch((error) => {
          console.error(error.response);
        });
        this.$emit('updateTasks');
      }).catch((error) => {
        console.error(error.response);
      });
    },
  },
};
</script>
