<template class="error-modal" >
  <b-modal hide-header body-class="error-modal-body" :visible="showErrorModal" @close="close()" hide-footer title="Server error">
    <div class="d-block error-modal text-center">
      <div>
        <i class="fa fa-exclamation-triangle icon-error"></i>
        <h3 class="error-title">Oh sorry!</h3>
        <p class="error-text">{{errorText}}</p>
        <b-btn @click ="close()" class="error-close">Close</b-btn>
      </div>
      </div>
  </b-modal>
</template>

<script>
export default {
  name: 'error-modal',
  props: ['errorText', 'showErrorModal'],
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
  .error-modal-body {
    overflow: hidden;
  }
  .error-modal {
    margin: -17px;
  }
  .error-close {
    background: #ff4141;
    color: white;
    border: none;
    width: 99.7%;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    margin-top: 12px;
    padding: 9px 0;
    outline: none;
  }
  .icon-error {
    color: #ff4141;
    font-size: 70px;
    margin: 20px 0;
  }

  .error-title {
    color: #5d5d5d;
  }

  .error-text {
    color: #5d5d5d;
  }
</style>
