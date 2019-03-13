<template>
  <b-container fluid :class='showSidebar ? "toggle sidebar-is-opened" : ""' >
    <div class="sidebar">
      <router-link class='logo' to='/dashboard'><img class='responsive' src="../../assets/img/logo.jpg" alt=""></router-link>
      <a href='https://api.consulting.com/admin/'>Admin</a>
      <router-link to='/dashboard'>Dashboard</router-link>
      <router-link to='/dashboard/tasks'>Tasks</router-link>
      <router-link to='/dashboard/settings'>Settings</router-link>
      <a href='#' @click="signOut" class='signout'>Sign out</a>
    </div>
    <div id='main'>
      <b-row>
        <template v-if='isClientDashboard'>
            <div class="client-dashboard__prefix">
              <div class="client-dashboard__client_name">
                <img v-if="client.logo" class='responsive' src="client.logo" alt="" height="50">
                <span v-else>{{ client.name }}</span>
              </div>
              <div class="client-dashboard_logo">
                <img class='responsive' src="../../assets/img/logoMin.jpg" alt="" height="50" style="text-align: right">
              </div>
            </div>
            <b-nav class='blue-nav-bar'>
              <b-nav-item>
                <b-btn style="margin-left: 15px" @click='showSidebar = !showSidebar'>
                  <i class="fa fa-bars" aria-hidden="true"></i>
                </b-btn>
              </b-nav-item>
              <b-nav-item><router-link :to='{name: "Client Main", params: {id: clientId}}'>Home</router-link></b-nav-item>
              <b-nav-item><router-link :to='{name: "Client Onboarding", params: {id: clientId}}'>Onboarding</router-link></b-nav-item>
              <b-nav-item><router-link :to='{name: "Client Tasks", params: {id: clientId}}'>Tasks</router-link></b-nav-item>
              <b-nav-item><router-link :to='{name: "Client Sqr", params: {id: clientId}}'>SQR</router-link></b-nav-item>
              <b-nav-item><router-link :to='{name: "Client Ppr", params: {id: clientId}}'>PPR</router-link></b-nav-item>
            </b-nav>
        </template>
        <template v-if='!isClientDashboard'>
          <b-btn class="open-side-bar-btn" @click='showSidebar = !showSidebar'>
            <i class="fa fa-bars" aria-hidden="true"></i>
          </b-btn>
        </template>
        <b-col class='main-view' cols='12'>
          <router-view></router-view>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'dashboard-wrapper',
  data () {
    return {
      showSidebar: false,
      client: {}
    }
  },
  computed: {
    clientId () {
      return this.$route.params.id
    },
    isClientDashboard () {
      return this.$route.path.indexOf('/client') >= 0
    }
    // },
    // client () {
    //   alert(this.$store.state.client.name)
    //   return this.$store.state.client
    // }
  },
  methods: {
    signOut () {
      window.location = window.localStorage.getItem('userToken')
      window.localStorage.removeItem('userToken')
    },
    changeClient () {
      if (this.$route.fullPath.indexOf('/client') >= 0) {
        if (this.$store.state.client.id !== this.$route.params.id) {
          this.axios.get(
            this.newApiProperty + '/api/clients/' + this.$route.params.id + '/',
            this.configWithCredentials)
          .then((resp) => {
            if (resp.status === 401 || resp.status === 403) {
              this.$router.push('/')
            }
            this.client = resp.data
            this.$store.commit('changeClient', resp.data)
          })
        }
      }
    }
  },
  created () {
    this.changeClient()
  },
  watch: {
    '$route' (from, to) {
      this.changeClient()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.signout {
  cursor: pointer;
}

.header-logo {
  height: 80px;
}

.client-logo {
  height: 80px;
  width: auto;
  margin-right: 10px;
}

.header-client,
.nav-bar {
  max-width: 1310px;
  margin: 0 auto;
  padding: 0px 30px;
  margin-bottom: 30px;
}

.sidebar-btn {
  position: absolute;
  left: 5px;
  top: 5px;
}

.blue-nav-bar {
  background: #2861e0;
  padding: 3px 0;
  width: 100vw;
  margin: 0 -20px;
}

.blue-nav-bar .nav-item {
  display: flex;
  align-items: center;
}

.blue-nav-bar a {
  color: white;
  font-size: 20px;
}

.open-side-bar-btn {
  margin-top: 20px;
  margin-left: 15px
}

</style>
