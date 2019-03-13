<template>
  <div>
    <b-button class='filter-chanel m-2' @click="getCampaigns()">
      <i class="fa fa-plus" aria-hidden="true"></i>
    </b-button>
    <b-modal centered no-fade v-model="modalShow">
      Hello From Modal!
      <b-form-select v-model="selected" :options="options" class="mb-3" />
    </b-modal>
  </div>
</template>

<script>
  import {sqrService} from '../../../services/sqr'

  export default {
    data () {
      return {
        modalShow: false,
        selected: null,
        options: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: {'C': '3PO'}, text: 'This is an option with object value' },
          { value: 'd', text: 'This one is disabled', disabled: true }
        ]
      }
    },
    methods: {
      getCampaigns () {
        this.modalShow = true
        let response = sqrService.getCampaigns('5670405876482048')
        response.then((res) => {
          console.log(res)
        })
      }
    }
  }
</script>
