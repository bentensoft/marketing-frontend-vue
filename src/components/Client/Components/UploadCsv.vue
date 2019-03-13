<template>
  <b-col cols='12' class='mb-4 upload-wrapper'>
    <b-btn variant='primary' class='upload-btn'><input  @change='uploadCsv' type="file"><i class="fa fa-upload" aria-hidden="true"></i> Upload csv</b-btn>
    <p class="text-danger text-small">{{csvError}}</p>
  </b-col>
</template>

<script>
export default {
  name: 'upload-csv',
  data () {
    return {
      csvError: ''
    }
  },
  methods: {
    uploadCsv (e) {
      this.csvError = ''
      let files = e.target.files
      let docs = new FormData()
      for (var i = 0; i < files.length; i++) {
        let file = files.item(i)
        if (file.name.slice(-4) !== '.csv') {
          this.csvError = 'Only .csv files'
          return false
        }
        docs.append(file.name, file, file.name)
      }

      this.axios({
        method: 'post',
        url: '/clients/' + this.$route.params.id + '/sqr/upload/',
        headers: {
          'Authorization': 'Token ' + this.$store.state.userToken,
          'Content-type': 'multipart/form-data'
        },
        data: docs
      }).then((response) => {
        console.log(response)
        this.$toast('Uploaded', {
          className: ['btn-success', 'notif'],
          duration: 3000
        })
        this.$emit('updateInfo')
      }).catch((error) => {
        if (error.response.status === 400) {
          this.csvError = error.response.data.detail
        }
        if (error.response.status === 500) {
          this.csvError = 'Error occured. Maybe incorrect CSV data or file is corrupted'
        }
        console.log(error.response)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .upload-btn{
    position: relative;
  }

  .upload-btn input{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
