<template>
  <b-modal header-class='header-bg'  hide-footer @hidden="close" id='add-client' ref='addClient'>
    <label>Name <span class="text-danger">*</span></label>
    <b-form-input
     :class='!!nameErr?"is-invalid" : ""'
     v-model.trim="name"
     type="text"></b-form-input>
    <toggle-button
     :value="useCSV"
     @change='useCSV = !useCSV'
     color="#00AD89"
     :sync="true"
     :width='100'
     :height='32'
     :labels="{checked: 'Use CSV', unchecked: 'Use Google'}"></toggle-button>
    <template v-if='!useCSV'>
      <label>Google Spreadsheet <span class="text-danger">*</span></label>
      <b-form-input
      :class='!!spreadErr?"is-invalid" : ""'
      v-model.trim="spread"
      aria-describedby="spread-feeback"
      type="text"></b-form-input>
      <b-form-feedback v-if='false && spreadErr !== true && spreadErr !== false' id="spread-feedback">
        {{spreadErr}}
      </b-form-feedback>
    </template>
    <b-btn class="mt-3" variant="success" block @click="addClient">Add client</b-btn>
    <b-btn class="mt-3" variant="outline-danger" block @click="close">Close</b-btn>
  </b-modal>
</template>

<script>
export default {
  name: 'client-add',
  data () {
    return {
      name: '',
      spread: '',
      useCSV: false,
      nameErr: false,
      spreadErr: false
    }
  },
  methods: {
    close () {
      this.$refs.addClient.hide()
      this.$emit('close')
    },
    addClient () {
      // validate
      let error = false
      this.nameErr = false
      this.spreadErr = false
      if (this.name === '') {
        this.nameErr = true
        error = true
      }

      if (this.spread === '' && !this.useCSV) {
        this.spreadErr = true
        error = true
      }

      if (error) {
        return false
      }

      this.axios({
        method: 'post',
        url: '/clients/create/',
        headers: {
          'Authorization': 'Token ' + this.$store.state.userToken
        },
        data: {
          name: this.name,
          google_spreadsheet: this.useCSV ? '' : this.spread
        }
      }).then((resp) => {
        this.$refs.addClient.hide()
        this.$emit('updateList')
      }).catch((error) => {
        console.log(error.response.data.google_spreadsheet)
        if (error.response.data.google_spreadsheet) {
          this.spreadErr = error.response.data.google_spreadsheet[0]
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input {
    margin: 10px 0;
  }

  label {
    display: block;
  }
</style>
