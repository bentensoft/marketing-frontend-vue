<template class="success-modal" >
  <b-modal hide-header body-class="success-modal-body" :visible="showSuccessModal" @close="close()" hide-footer>
    <div class="d-block success-modal text-center">
      <div>
        <i class="fa fa-check-circle icon-success"></i>
        <h3 class="success-title">Awesome!</h3>
        <p class="success-text">{{successText}}</p>
        <b-btn @click="close()" class="success-close">Close</b-btn>
      </div>
      </div>
  </b-modal>
</template>

<script>
export default {
  name: 'success-modal',
  props: ['successText', 'showSuccessModal'],
  data () {
    return {
    }
  },
  methods: {
    close: function () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .success-modal-body {
    overflow: hidden;
  }
  .success-modal {
    margin: -17px;
  }
  .success-close {
    background: #7ef17b;
    color: white;
    border: none;
    width: 99.7%;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    margin-top: 12px;
    padding: 9px 0;
    outline: none;
  }
  .icon-success {
    color: #7ef17b;
    font-size: 70px;
    margin: 20px 0;
  }

  .success-title {
    color: #5d5d5d;
  }

  .success-text {
    color: #5d5d5d;
  }
</style>
