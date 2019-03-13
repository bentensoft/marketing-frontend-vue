<template>
  <b-row class="settings-page">
    <b-col cols='12'>
      <h2>Client Settings</h2>
    </b-col>
    <b-col cols='2'>
      <b-form-input
       v-model="search"
       type="text"
       placeholder="Search"></b-form-input>
    </b-col>
    <b-col cols='4'>
      <b-btn class="settings-page-btn" variant='white' @click='syncAdwords()'><img src="../../assets/img/googleadwords.png" alt=""> Sync clients</b-btn>
      <b-btn class="settings-page-btn" variant='primary' v-b-modal.add-client @click='showAddClientModal = true'>
        <i class="fa fa-plus" aria-hidden="true"></i> Add client
      </b-btn>
    </b-col>
    <b-col cols='4'>
      <transition v-if='loadingSync' name='fade'>
        <div>
          <p style="margin: 7px 0px -5px" class="ml-1"><b>Synchronizing Adwords Clients</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        </div>
      </transition>
    </b-col>
    <b-col cols='12'>
      <ErrorModal :showErrorModal="showErrorModal" @close='showErrorModal = false' :errorText="errorText"></ErrorModal>
      <SuccessModal :showSuccessModal="showSuccessModal" @close='showSuccessModal = false' :successText="successText"></SuccessModal>
      <table class="table ">
        <tr>
          <th>Client Name</th>
          <th class="id-cell">Adwords ID</th>
          <th class="id-cell">BingAds ID</th>
          <th class="id-cell">FacebookAds ID</th>
          <th class="id-cell">Site Url</th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for='(client, index) in clients' v-show="client.isShow" :key='index'>
          <td class="settings-client-name">{{client.name}}</td>
          <td class="id-cell">
            <b-form-input
              v-if="client.adwords"
              @input="changeId(index)"
              v-model="client.adwords.account_id"
              type="text"></b-form-input>
          </td>
          <td class="id-cell">
          <b-form-input
            v-if="client.bingads"
            @input="changeId(index)"
            v-model="client.bingads.account_id"
            type="text"></b-form-input>
          </td>
          <td class="id-cell">
            <b-form-input
              v-if="client.facebookads"
              @input="changeId(index)"
              v-model="client.facebookads.account_id"
            type="text"></b-form-input>
          </td>
          <td class="id-cell">
            <b-form-input
              @input="changeId(index)"
              v-model="client.siteurl"
            type="text"></b-form-input>
          </td>
          <td>
            <b-btn class="toggle-btn-settings" @click='changeEnabled(index, !client.hide)'
                   :variant='!client.hide ? "secondary" : "primary"'>
              {{client.hide ? 'Display' : 'Hide'}}
            </b-btn>
          </td>
          <td class="save-cell">
            <b-btn v-show="client.isEditMode" @click="saveClient(index)" variant='info'>Save</b-btn>
            <b-btn v-show="client.isEditMode" @click="undoClient(index)" variant='info'>Undo</b-btn>
            <transition style="text-align: center" v-if='client.loading' name='fade'>
              <div style="margin: 0 auto;">
                <p style="margin: 0" class="ml-1"><b>{{savingText}}</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
              </div>
            </transition>
          </td>
        </tr>
      </table>
    </b-col>
    <transition style="text-align: center" v-if='clients.length === 0' name='fade'>
      <div style="margin: 40px auto;">
        <p style="margin: 0" class="ml-1"><b>{{loadingText}}</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
      </div>
    </transition>
    <ModalAddClient v-if='showAddClientModal' @updateList='updateClientList()' @close='showAddClientModal = false'></ModalAddClient>
  </b-row>
</template>

<script>
import ErrorModal from './Modal/ErrorModal.vue'
import SuccessModal from './Modal/SuccessModal.vue'
import ModalAddClient from './Modal/AddClient.vue'
export default {
  name: 'settings',
  data () {
    return {
      fullClientList: [],
      clients: [],
      loadingSync: false,
      loadingText: 'Loading',
      savingText: 'Saving',
      showAddClientModal: true,
      showSuccessModal: false,
      showErrorModal: false,
      search: '',
      adsList: ['adwords', 'bingads', 'facebookads'],
      errorText: 'Server error, please try later',
      successText: 'Successful synchronization'
    }
  },
  components: {
    ModalAddClient,
    ErrorModal,
    SuccessModal
  },
  watch: {
    search: function () {
      if (this.search !== '') {
        let search = this.search.toLowerCase()
        this.clients.forEach((client) => {
          client.isShow = client.name.toLowerCase().indexOf(search) >= 0
        })
      } else {
        this.clients.forEach((client) => {
          client.isShow = true
        })
      }
    }
  },
  methods: {
    changeId (index) {
      this.clients[index].isEditMode = true
    },
    syncAdwords () {
      this.loadingSync = true
      this.axios.get(
        this.newApiProperty + '/api/adwords/clients',
        this.configWithCredentials
      ).then((response) => {
        this.updateClientList()
        this.loadingSync = false
        this.successText = response.data.message
        this.showSuccessModal = false
        setTimeout(() => {
          this.showSuccessModal = true
        }, 0)
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        this.loadingSync = false
        console.log(error.response)
      })
    },
    updateClientList () {
      this.clients = []
      this.axios.get(
        this.newApiProperty + '/api/clients?filter_by=all',
        this.configWithCredentials
      ).then((response) => {
        this.clients = response.data.data.map((cl) => {
          cl.isEditMode = false
          cl.isShow = true
          cl.loading = false
          return cl
        })
        this.fullClientList = JSON.parse(JSON.stringify(this.clients))
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        console.log(error.response)
      })
    },
    saveClient (index) {
      let result = {}
      this.clients[index].isEditMode = false
      this.clients[index].loading = true
      this.adsList.forEach((key) => {
        if (this.clients[index][key] && this.clients[index][key].account_id !== this.fullClientList[index][key].account_id) {
          result[key] = {}
          result[key].account_id = this.clients[index][key].account_id
        }
      })
      result["siteurl"] = this.clients[index]["siteurl"]
      this.changeEnabled(index, this.clients[index].hide, result)
    },
    changeOneClient (index, newClient, isChangeFullList) {
      this.adsList.forEach((key) => {
        if (this.clients[index][key]) {
          this.clients[index][key].account_id = newClient[key].account_id
        }
        if (isChangeFullList && this.clients[index][key]) {
          this.fullClientList[index][key].account_id = newClient[key].account_id
        }
      })
    },
    undoClient (index) {
      this.changeOneClient(index, this.fullClientList[index])
      setTimeout(() => {
        this.clients[index].isEditMode = false
      }, 0)
    },
    changeEnabled (index, isEnabled, result) {
      if (!result) {
        result = {
          hide: isEnabled
        }
        this.undoClient(index)
        this.clients[index].loading = true
      }
      let id = this.clients[index].customer_id || this.clients[index].id
      this.axios.post(
        this.newApiProperty + '/api/clients/' + id + '/',
        result,
        this.configWithCredentials
      ).then((response) => {
        this.clients[index].loading = false
        if (response.data.error) {
          this.errorText = response.data.error
          this.showErrorModal = false
          setTimeout(() => {
            this.showErrorModal = true
          }, 300)
          this.undoClient(index)
        } else {
          this.clients[index].hide = isEnabled
          this.changeOneClient(index, response.data, true)
          this.showErrorModal = false
        }
      }).catch((error) => {
        this.clients[index].loading = false
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        this.showErrorModal = false
        setTimeout(() => {
          this.showErrorModal = true
        }, 300)
        this.undoClient(index)
      })
    }
  },
  created () {
    this.updateClientList()
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1280px;
  margin: 0 auto;
}
input {
  margin-bottom: 20px;
}
.table {
  font-size: 16px;
  margin-top: 10px;
}

.table .btn{
  padding: 4px;
}

.table th,
.table td{
  padding-top: 2px;
  padding-bottom: 2px;
}
.table td:first-child{
  padding-top: 7px;
  padding-bottom: 2px;
}

.btn  img{
  height: 20px;
  width: auto;
}
.table td{
  vertical-align: middle;
}

input {
  margin: 3px;
}

.id-cell {
  max-width: 150px;
  text-align: center;
}

  .save-cell {
    min-width: 150px;
  }

  .toggle-btn-settings {
    min-width: 78px;
  }

  .settings-page-btn {
    margin: 2px 3px;
    border: 1px solid #cbcfd5;
    font-size: 18px;
    line-height: 25px;
  }

  .settings-client-name {
    width: 33%;
  }
</style>
