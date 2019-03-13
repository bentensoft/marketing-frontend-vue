<template>
  <b-modal modal-class="edit-modal-main"	body-class="body-class" header-class='header-bg' centered no-fade hide-footer @hidden="close"  id='edit-client' :visible="editClient">
    <label>Name</label>
    <b-form-input
     v-model="clientName"
     type="text"
     disabled></b-form-input>
    <b-form-input
      v-model="clientInfo.adwords.account_id"
      disabled
      type="text"></b-form-input>
    <table class="edit-modal">
      <tr>
        <td></td>
        <td>Goal for spend (budget)</td>
        <td>Goal for CPA</td>
      </tr>
      <tr>
        <td><div class="ad-bg2 social-label">Adwords</div></td>
        <td class="currency">
          <vue-numeric decimal-separator="." separator="," v-model="clientInfo.adwords.budget"></vue-numeric>
        </td>
        <td class="currency">
          <vue-numeric v-bind:precision="2" decimal-separator="." separator="," v-model="clientInfo.adwords.planned_cpa"></vue-numeric>
        </td>
      </tr>
      <tr>
        <td><div class="bing-bg social-label">BingAds</div></td>
        <td class="currency">
          <vue-numeric decimal-separator="." separator="," v-model="clientInfo.bingads.budget"></vue-numeric>
        </td>
        <td class="currency">
          <vue-numeric v-bind:precision="2" decimal-separator="." separator="," v-model="clientInfo.bingads.planned_cpa"></vue-numeric>
        </td>
      </tr>
      <tr>
        <td><div class="fb-bg social-label">FacebookAds</div></td>
        <td class="currency">
          <vue-numeric decimal-separator="." separator="," v-model="clientInfo.facebookads.budget"></vue-numeric>
        </td>
        <td class="currency">
          <vue-numeric v-bind:precision="2" decimal-separator="." separator="," v-model="clientInfo.facebookads.planned_cpa"></vue-numeric>
        </td>
      </tr>
    </table>
    <b-btn class="mt-3" variant="outline-success" block @click="saveChanges">Save</b-btn>
    <b-btn class="mt-3" variant="outline-danger" block @click="close">Close</b-btn>
  </b-modal>
</template>

<script>
import VueNumeric from 'vue-numeric'
export default {
  name: 'client-edit',
  data () {
    return {
      clientInfo: {
      },
      clientName: '',
      editClient: true,
      tabIndex: 0
    }
  },
  components: {
    VueNumeric
  },
  methods: {
    close () {
      this.editClient = false
      this.$emit('close')
    },
    changeTab (tabIndex) {
      this.tabIndex = tabIndex
    },
    saveChanges () {
      for (let key in this.clientInfo) {
        this.clientInfo[key].budget = parseFloat(this.clientInfo[key].budget)
        this.clientInfo[key].planned_cpa = parseFloat(this.clientInfo[key].planned_cpa)
      }
      this.axios.post(
        this.newApiProperty + '/api/clients/' + this.$store.state.editClientId + '/',
        this.clientInfo,
        this.configWithCredentials
      ).then((resp) => {
        this.$emit('saveChanges', resp.data)
        this.$emit('close')
      }).catch((error) => {
        console.log(error.response)
      })
    },
    fillAds (data) {
      this.clientName = data.name
      this.clientInfo = {
        adwords: {
          'account_id': data.adwords.account_id || '',
          'budget': data.adwords.budget ? data.adwords.budget : 0,
          'planned_cpa': data.adwords.planned_cpa ? parseFloat(data.adwords.planned_cpa) : 0
        },
        bingads: {
          'account_id': data.bingads.account_id || '',
          'budget': data.bingads.budget ? data.bingads.budget : 0,
          'planned_cpa': data.bingads.planned_cpa ? parseFloat(data.bingads.planned_cpa) : 0
        },
        facebookads: {
          'account_id': data.facebookads.account_id || '',
          'budget': data.facebookads.budget ? data.facebookads.budget : 0,
          'planned_cpa': data.facebookads.planned_cpa ? parseFloat(data.facebookads.planned_cpa) : 0
        }
      }
    }
  },
  mounted () {
    this.editClient = true
    this.axios.get(
      this.newApiProperty + '/api/clients/' + this.$store.state.editClientId + '/',
      this.configWithCredentials)
    .then((resp) => {
      this.fillAds(resp.data)
    }).catch((error) => {
      console.error(error)
    })
  }
}
</script>

<style>
  .modal-dialog-centered .modal-content {
    width: 130% !important;
  }
</style>
<style scoped>
  input {
    margin: 10px 0;
  }

  .card-header-tabs {
    outline: none!important;
  }

  .header-bg {
    background: url(/static/img/logo.692bf3d.jpg) no-repeat;
    background-size: contain;
    margin: 5px 3%;
  }

  .social-label {
    background-repeat: no-repeat;
    background-size: 17%;
    background-position: 2%;
    padding-left: 40px !important;
    margin-left: 10px;
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 4px;
    text-align: left;
  }

  .ad-bg2 {
    background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ41rnchc1hdNFU0KgarS1kjnyGBPYSoZV8rBQrt2Ou8bOhERr) !important;
  }
  .bing-bg {
    background-image: url(https://referencementwordpress.com/wp-content/uploads/2016/09/www.abondance.comBinb-de-bing-vert-838dbce94af0fbdc0ae42be107580d3519207022.jpg) !important;
  }
  .fb-bg {
    background-image: url(https://www.shareicon.net/download/2015/09/23/106006_logo.svg) !important;
  }

  .edit-modal th, .edit-modal td {
    text-align: left;
    padding: 0px 0px 0 0px;
    margin-left: 5px;
    font-family: Circular Std,serif;
  }

  .body-class {
    min-width: 600px;
  }

  td input {
    border-radius: 3px;
    border: 1px solid #d3d3d3;
    padding: 5px 0 5px 15px;
    /*margin-right: -20px;*/
    font-size: 16px;
    color: #575c62;
  }

  .currency::before {
    content: "$";
    color: #575c62;
    margin: 0 -15px 0 8px;
    z-index: 9;
    position: relative;
  }

</style>
