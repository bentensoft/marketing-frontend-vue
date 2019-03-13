<template>
  <b-container>
    <b-row align-h='center' align-v='center'>
      <div class="form"  v-show="showPage">
        <img class='responsive' src="../../assets/img/logo.jpg" alt="">
        <h2>Sign In</h2>
        <b-button v-if="signInShow" variant='primary' @click='signIn'>Sign in with google</b-button>
        <transition style="text-align: center" v-if='!signInShow' name='fade'>
        <p class="ml-1 sign-in-loader"> Checking your credentials <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        </transition>
      </div>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    name: 'sing-in',
    data () {
      return {
        login: null,
        password: null,
        link: '',
        signInShow: true,
        showPage: false
      }
    },
    methods: {
      signIn () {
        this.signInShow = false
        window.location = this.link
      }
    },
    created: function () {
      this.axios.get(
        this.newApiProperty + '/isLoggedIn',
        this.configWithCredentials
      ).then((resp) => {
        if (resp.data.authorized) {
          window.localStorage.setItem('userToken', resp.data.logout_url)
          this.$router.push('/dashboard')
        } else {
          this.link = resp.data.login_url
          this.showPage = true
        }
      }).catch((error) => {
        console.log(error.response)
      })
    }
  }
</script>

<style scoped>
  h2 {
    margin-top: 30px;
  }

  .form{
    padding: 20px;
    width: 300px;
    text-align: center;
  }

  button{
    margin-top: 20px;
    width: 100%;
    font-size: 20px;
  }

  img{
    max-width: 100%;
    height: 200px;
    width: auto;
  }

  input[type='text'] {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  input[type='password'] {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  .sign-in-loader {
    margin-top: 35px;
    font-size: 20px;
    font-weight: 600;
    color: #8b9a8a;
  }
</style>
