<template>
  <b-row class='main-dashboard'>
    <b-col cols='12'>
      <h2>Consulting Client Dashboard</h2>
    </b-col>
    <div cols='12' class='unfrozen-row dash-row col-12'>
      <b-col cols='4' md="3">
        <b-form-input
          v-model.trim="search"
          type="text"
          class="search-dash-select"
          placeholder="Search"></b-form-input>
      </b-col>
      <b-col cols='4' md="3">
        <b-form-select @input='updateTable(timeframe)' v-model="timeframe" :options="date" class="mb-3"></b-form-select>
      </b-col>
      <b-col cols='2' sm="4" md="4" class='filter-chanel'>
        <b-button :variant='googleFilter ? "" : "disable-chanel"' @click='filterTable("googleFilter")'>
          <img src="../../assets/img/googleadwords.png" alt="">
        </b-button>
        <b-button :variant='bingFilter ? "" : "disable-chanel"' @click='filterTable("bingFilter")'>
          <img class="bing-icon" src="../../assets/img/bing.png" alt="">
        </b-button>
        <b-button class="dash-row-btn" @click='filterTable("fbFilter")'>
          <img :class='fbFilter ? "" : "disable-fb"' src="../../assets/img/fb.png" alt="">
        </b-button>
      </b-col>
      <b-col cols='2'>
        <transition style="text-align: center" v-if='loadFilter' name='fade'>
          <p style="margin-top: 5px" class="ml-1"><b>Filtering</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
        </transition>
      </b-col>
    </div>
    <b-col cols='12 'v-bind:class="isShowSearchBar ? 'frozen-arrow' : 'un-frozen-arrow'">
      <div v-if='clientList.length !== 0' id="client-table">
        <i @click='toggleSocFilters = !toggleSocFilters' :class='[toggleSocFilters ? "rotate" : "", isShowSearchBar? "frozen-row-head" : ""]'
           class="toggle-btn arrow">
          <svg viewBox="0 0 17 16" version="1.1"
               xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               class="si-glyph si-glyph-arrow-right">
            <title>1178</title>
            <defs></defs>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path
                d="M6.077,1.162 C6.077,1.387 6.139,1.612 6.273,1.812 L10.429,8.041 L6.232,14.078 C5.873,14.619 6.019,15.348 6.56,15.707 C7.099,16.068 7.831,15.922 8.19,15.382 L12.82,8.694 C13.084,8.3 13.086,7.786 12.822,7.39 L8.233,0.51 C7.873,-0.032 7.141,-0.178 6.601,0.181 C6.26,0.409 6.077,0.782 6.077,1.162 L6.077,1.162 Z"
                fill="#0056b3" class="si-glyph-fill"></path>
            </g>
          </svg>
        </i>
        <table class="masters">
          <tr v-show="isShowSearchBar" class="head frozen-row-head">
            <template v-for="filter in typeFiltersList">
              <th
                @click='sortType === filter.name ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sortType = filter.name '
                :class="filter.class ? filter.name : ''"> {{filter.fullName}}
                <i v-if='sortType === filter.name' :class='!sortDirectionDown ? "rotate" : ""'><i
                  class="fa fa-arrow-down arrow-icon" aria-hidden="true"></i></i>
              </th>
            </template>
          </tr>
          <tr class="head header-table">
            <template v-for="filter in typeFiltersList">
              <th
                @click='sortType === filter.name ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sortType = filter.name '
                :class="filter.class ? filter.name : ''"> {{filter.fullName}}
                <i v-if='sortType === filter.name' :class='!sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
              </th>
            </template>
          </tr>
          <tbody v-for='master in filteredClietList'>
            <template class="master">
              <tr v-show='master.searchShow' :style="master.toggle ? styleObject : ''"  class="master">
                <template v-if='master.name !== "Consulting MCC"'>
                  <td class="client_name_blue masterName title" v-show='master.clients'
                      @click='master.toggle = !master.toggle'>
                    <i :class='master.toggle ? "rotate" : ""' class="arrow arrow-icon">
                      <svg viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-arrow-right">
                        <title>1178</title>
                        <defs></defs>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <path
                            d="M6.077,1.162 C6.077,1.387 6.139,1.612 6.273,1.812 L10.429,8.041 L6.232,14.078 C5.873,14.619 6.019,15.348 6.56,15.707 C7.099,16.068 7.831,15.922 8.19,15.382 L12.82,8.694 C13.084,8.3 13.086,7.786 12.822,7.39 L8.233,0.51 C7.873,-0.032 7.141,-0.178 6.601,0.181 C6.26,0.409 6.077,0.782 6.077,1.162 L6.077,1.162 Z"
                            fill="#434343" class="si-glyph-fill"></path>
                        </g>
                      </svg>
                    </i>
                    <span class="client_name"> {{master.name}}</span>
                  </td>
                  <td v-show='!master.clients' @click='master.toggle = !master.toggle'
                      class="client_name_blue masterName title" :title="master.name">
                    <i :class='master.toggle ? "rotate" : ""' class="arrow arrow-icon">
                      <svg viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-arrow-right">
                        <title>1178</title>
                        <defs></defs>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <path
                            d="M6.077,1.162 C6.077,1.387 6.139,1.612 6.273,1.812 L10.429,8.041 L6.232,14.078 C5.873,14.619 6.019,15.348 6.56,15.707 C7.099,16.068 7.831,15.922 8.19,15.382 L12.82,8.694 C13.084,8.3 13.086,7.786 12.822,7.39 L8.233,0.51 C7.873,-0.032 7.141,-0.178 6.601,0.181 C6.26,0.409 6.077,0.782 6.077,1.162 L6.077,1.162 Z"
                            fill="#4495cf" class="si-glyph-fill"></path>
                        </g>
                      </svg>
                    </i>
                    <router-link :to='{name: "Client Main", params: {id: master.customer_id}}'>{{master.name}}
                    </router-link>
                    <b-button class='edit-btn' v-b-modal.edit-client size='sm'
                              @click='changeClientModalId(master.customer_id, $event)' variant='link'>
                      <i class="fa fa-pencil" aria-hidden="true"></i>
                    </b-button>
                  </td>
                  <td :class='customClass(master.budget)'>{{makeComa(master.budget, '$', true)}}</td>
                  <td :class='customClass(master.pace)'>{{makeComa(master.pace, '$', true)}}</td>
                  <td :class='customClass(master.spend)'>{{makeComa(master.spend, '$', true)}}  </td>
                  <td class="pers"
                      :class='master.spend_distance >= 0 ? "text-success" : "text-danger"'>
                    {{master.spend === 0 ? '' : makeComa(master.spend_distance, '%', true)}}
                  </td>
                  <td :class='customClass(master.conversions)'>{{makeComa(master.conversions)}} </td>
                  <td class="pers"
                      :class='master.conversions >= 0 ? "text-success" : "text-danger"'>
                    {{master.planned_conversions === 0 ? '' : makeComa(master.conversions_distance, '%')}}
                  </td>
                  <td :class='customClass(master.cpa)'>{{customizeCpa(master.cpa, '$')}}  </td>
                  <td class="pers"
                      :class='master.spend_distance >= 0 ? "text-success" : "text-danger"'>
                    {{master.planned_cpa === 0 ? '' : customizeCpaPer(master.cpa_distance, '%')}}
                  </td>
                  <td class="tasks" :class='customClass(master.tasks)'>
                    <router-link :to='{name: "Client Tasks", params: {id: master.customer_id}}'>
                      {{makeComa(master.tasks)}}
                    </router-link>
                  </td>
                  <td class="onboarding" :class='customClass(master.onboarding)'>
                    <span>{{makeComa(master.onboarding)}}</span>
                  </td>
                </template>
              </tr>

              <template v-if='!master.clients && master.searchShow && master.toggle' class="companies">
                <AdsRow v-show="master.adwords && master.searchShow" :client="master.adwords" typeRow="googleadwords"></AdsRow>
                <AdsRow v-show="master.bingads && master.searchShow" :client="master.bingads" typeRow="bing"></AdsRow>
                <AdsRow v-show="master.facebookads && master.searchShow" :client="master.facebookads" typeRow="fb"></AdsRow>
              </template>
              <template v-if='master.toggle && master.searchShow' v-for='client in master.clients' class="clients">
                <ManagerClient v-on:changeClientModalId="changeClientModalId" :client="client"></ManagerClient>
                <template v-if='client.toggle' name='fade'>
                  <AdsRow v-show="client.adwords && master.searchShow && client.searchShow" :client="client.adwords" typeRow="googleadwords"></AdsRow>
                  <AdsRow v-show="client.bingads && master.searchShow && client.searchShow" :client="client.bingads" typeRow="bing"></AdsRow>
                  <AdsRow v-show="client.facebookads && master.searchShow && client.searchShow" :client="client.facebookads" typeRow="fb"></AdsRow>
                </template>
              </template>
            </template>
        </tbody>
        </table>
      </div>
    </b-col>
    <transition style="text-align: center" v-if='clientList.length === 0' name='fade'>
      <div style="margin: 40px auto;">
        <p style="margin: 0" class="ml-1"><b>{{loadingText}}</b> <i class="fa fa-spinner fa-spin"
                                                                    aria-hidden="true"></i></p>
      </div>
    </transition>
    <ModalEditClient @saveChanges="saveEditClient" @close='showEditClientModal = false'
                     v-if='showEditClientModal'></ModalEditClient>
  </b-row>
</template>

<script>
  import ModalEditClient from './Modal/EditClient.vue'
  import Loader from '@/components/UI/Loader.vue'
  import ManagerClient from './Components/DashboardManagerClient.vue'
  import AdsRow from './Components/DashboardAdsRow.vue'
  import ClientRow from './Components/DashboardClientRow.vue'

  export default {
    name: 'main-dashboard',
    data () {
      return {
        loadingText: 'Loading',
        loadFilter: false,
        typeFiltersList: [
          {
            name: 'name',
            fullName: 'Client name',
            class: true
          },
          {
            name: 'budget',
            fullName: 'Budget'
          },
          {
            name: 'pace',
            fullName: 'Pace'
          },
          {
            name: 'spend',
            fullName: 'Spend'
          },
          {
            name: 'pers',
            fullName: '',
            class: true
          },
          {
            name: 'conversions',
            fullName: 'Conv.',
            class: true
          },
          {
            name: 'pers',
            fullName: '',
            class: true
          },
          {
            name: 'cpa',
            fullName: 'CPA'
          },
          {
            name: 'pers',
            fullName: '',
            class: true
          },
          {
            name: 'tasks',
            fullName: 'Tasks',
            class: true
          },
          {
            name: 'onboarding',
            fullName: 'Onboarding',
            class: true
          }
        ],
        showEditClientModal: false,
        timeframe: '09-2017',
        date: [],
        search: '',
        clientList: [],
        fbFilter: true,
        googleFilter: true,
        bingFilter: true,
        max: 100,
        toggleSocFilters: false,
        sortType: 'name',
        sortDirectionDown: false,
        tempArray: [],
        isShowSearchBar: false,
        disabledFiltersList: [],
        styleObject: {
          backgroundColor: '#7db8f769',
          fontWeight: 'bold'
        }
      }
    },
    components: {
      ModalEditClient,
      Loader,
      ManagerClient,
      AdsRow,
      ClientRow
    },
    methods: {
      filterTable (filterName) {
        this.loadFilter = true
        let shouldDeleteIndex = this.disabledFiltersList.findIndex((item) => item === filterName)
        if (shouldDeleteIndex > -1 || this.disabledFiltersList.length < 2) {
          this[filterName] = !this[filterName]
          this.updateTable(undefined, this.toggleSocFilters)
          shouldDeleteIndex > -1 ? this.disabledFiltersList.splice(shouldDeleteIndex, 1) : this.disabledFiltersList.push(filterName)
        } else {
          this.loadFilter = false
        }
      },
      saveEditClient (client) {
        let index = this.clientList.findIndex((cl) => {
          return cl.id === client.id
        })
        this.clientList[index] = Object.assign(this.clientList[index], client)
      },
      updateTable (time, toggleSocFilters) {
        const timeframe = time === undefined ? '' : 'timeframe=' + time
        const sources = '&source=' + (this.googleFilter ? 'adwords,' : '') + (this.fbFilter ? 'facebookads,' : '') + (this.bingFilter ? 'bingads' : '')
        console.log('This api: ' + this.newApiProperty)
        this.axios.get(this.newApiProperty + '/api/clients?' + timeframe + sources,
          this.configWithCredentials
        ).then((resp) => {
          this.fillTable(resp, toggleSocFilters)
        })
          .catch((error) => {
            if (error.status === 401 || error.status === 403) {
              this.$router.push('/')
            }
          })
      },
      fillTable (resp, toggleSocFilters) {
        let list = resp.data.data
        list.forEach((master) => {
          if (toggleSocFilters === undefined || (this.search === '' || master.name.toLowerCase().indexOf(this.search) > -1)) {
            master.searchShow = true
          }
          master.toggle = !!toggleSocFilters
          if (!master.clients) {
            master.budget = master.aggregated.budget
            master.pace = master.aggregated.pace
            master.spend = master.aggregated.spend
            master.cpa = master.aggregated.cpa
            master.conversions = master.aggregated.conversions
            master.planned_cpa = master.aggregated.planned_cpa
            master.planned_conversions = master.aggregated.planned_conversions
            master.tasks = master.tasks || 0
            master.onboarding = master.onboarding || 0
            master.spend_distance = master.spend === 0 ? 0 : Math.round(master.aggregated.spend_distance)
            master.cpa_distance = master.cpa === 0 ? 0 : Math.round(master.aggregated.cpa_distance)
            master.conversions_distance = master.conversions === 0 ? 0 : Math.round(master.aggregated.conversions_distance)
          } else {
            master.clients.forEach((client) => {
              client.toggle = !!toggleSocFilters
              if (toggleSocFilters === undefined || (this.search === '' || client.name.toLowerCase().indexOf(this.search) > -1)) {
                client.searchShow = true
              }
              client.pace = client.aggregated.pace
              client.budget = client.aggregated.budget
              client.spend = client.aggregated.spend
              client.conversions = client.aggregated.conversions
              client.planned_conversions = client.aggregated.planned_conversions
              client.planned_cpa = client.aggregated.planned_cpa
              client.cpa = client.aggregated.cpa
              client.cpa_distance = client.cpa === 0 ? 0 : Math.round(client.aggregated.cpa_distance)
              client.conversions_distance = client.conversions === 0 ? 0 : Math.round(client.aggregated.conversions_distance)
              client.spend_distance = client.spend === 0 ? 0 : Math.round(client.aggregated.spend_distance)
            })
            master.budget = this.getAggregatedData(master, 'budget')
            master.pace = this.getAggregatedData(master, 'pace')
            master.spend = this.getAggregatedData(master, 'spend')
            master.cpa = this.getAggregatedData(master, 'cpa')
            master.conversions = this.getAggregatedData(master, 'conversions')
            master.planned_cpa = this.getAggregatedData(master, 'planned_cpa')
            master.planned_conversions = this.getAggregatedData(master, 'planned_conversions')
          }
        })
        list = list.filter((elem) => {
          return elem.name
        })
        this.clientList = list
        this.loadFilter = false
      },
      getAggregatedData (client, field) {
        return (client.aggregated_data.ads.adwords[field] || 0) + (client.aggregated_data.ads.bingads[field] || 0) + (client.aggregated_data.ads.facebookads[field] || 0)
      },
      setFrozenHeader () {
        let unfrozenCells = Array.from(document.querySelectorAll('.header-table th'))
        let frozenCells = Array.from(document.querySelectorAll('.frozen-row-head th'))
        if (!unfrozenCells[0]) {
          setTimeout(() => {
            this.setFrozenHeader()
          }, 100)
        } else {
          frozenCells.map((cell, index) => {
            cell.style.width = unfrozenCells[index].offsetWidth + 'px'
          })
        }
      },
      makeComa (val, sign, isRound) {
        if (sign === '%' && !val) return ''
        if (sign !== '%' && !val) return '-'
        else {
          if (val.toString().indexOf('.') > -1) {
            val = isRound ? Math.round(val) : parseFloat(val).toFixed(2)
          }
          val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          if (sign) {
            return sign === '$' ? sign + '' + val : val + '%'
          }
          return val
        }
      },
      customizeCpa (val, sign) {
        if (!val) return '-'
        if (val < 100) {
          return sign + '' + val.toFixed(2)
        } else {
          return sign + '' + Math.round(val)
        }
      },
      customizeCpaPer (val, sign) {
        if (!val) return ''
        else {
          return Math.round(val) + sign
        }
      },
      customClass (val) {
        if (!val) return 'invalid-num'
      },
      changeClientModalId (val, event) {
        event.stopPropagation()
        this.showEditClientModal = true
        this.$store.commit('changeEditClietnId', val)
      },
      getSortByFunction () {
        return (a, b) => {
          if (a[this.sortType] < b[this.sortType]) {
            return 1
          }
          if (a[this.sortType] > b[this.sortType]) {
            return -1
          }
        }
      },
      handleScroll () {
        this.setFrozenHeader()
        if (window.pageYOffset > 200) {
          this.isShowSearchBar = true
        } else {
          this.isShowSearchBar = false
        }
      },
      signIn () {
        this.axios({
          method: 'get',
          url: this.newApiProperty + '/isLoggedIn',
          withCredentials: true
        }).then((resp) => {
          if (resp.data.authorized) {
            window.localStorage.setItem('userToken', resp.data.logout_url)
          } else {
            this.$router.push('/')
          }
        }).catch((error) => {
          if (error.status === 401 || error.status === 403) {
            this.$router.push('/')
          }
        })
      },
      auth () {
        this.updateTable()
        const monthInText = (val) => {
          switch (val) {
            case 0: return 'January'
            case 1: return 'February'
            case 2: return 'March'
            case 3: return 'April'
            case 4: return 'May'
            case 5: return 'June'
            case 6: return 'July'
            case 7: return 'August'
            case 8: return 'September'
            case 9: return 'October'
            case 10: return 'November'
            case 11: return 'December'
          }
        }
        let now = new Date()
        now.setMonth(now.getMonth() + 1)
        this.timeframe = now.getMonth() + '-' + now.getFullYear()

        for (var i = 0; i < 6; i++) {
          let newOptions = {}
          newOptions.value = now.getMonth() + '-' + now.getFullYear()
          now.setMonth(now.getMonth() - 1)
          newOptions.text = monthInText(now.getMonth()) + ' ' + now.getFullYear()
          this.date.push(newOptions)
        }
        window.addEventListener('scroll', this.handleScroll)
      },
      isShowRow (client) {
        return client.budget || client.pace || client.conversions || client.cpa || client.spend
      }
    },
    watch: {
      search: function () {
        let clientList = this.clientList
        let search = this.search.toLowerCase()
        if (search === '') {
          clientList.forEach((master) => {
            master.searchShow = true
            if (master.clients) {
              master.clients.forEach((client) => {
                client.searchShow = true
              })
            }
          })
        } else {
          clientList.forEach((master) => {
            master.searchShow = false
            if (master.clients) {
              if (master.name.toLowerCase().indexOf(search) > -1) {
                master.searchShow = true
              }
              let isShow = false
              master.clients.forEach((client) => {
                client.searchShow = false
                let value = (client['name'] + '').toLowerCase()
                if (value.indexOf(search) > -1) {
                  client.searchShow = true
                  isShow = true
                }
              })
              master.toggle = isShow
            } else if (master.name.toLowerCase().indexOf(search) > -1) {
              master.searchShow = true
            }
            const showClients = (client) => {
              return client.searchShow
            }

            if (master.clients && master.clients.some(showClients)) {
              master.searchShow = true
            }
          })
        }
      },
      toggleSocFilters: function () {
        this.filteredClietList.forEach((master) => {
          master.toggle = this.toggleSocFilters
          if (master.clients) {
            master.clients.forEach((client) => {
              client.toggle = this.toggleSocFilters
            })
          }
        })
      }
    },
    computed: {
      filteredClietList () {
        let clientList = this.clientList
        clientList.forEach((master) => {
          master.toggle = !!this.toggleSocFilters
          if (!master.clients) {
            master.budget = master.aggregated.budget
            master.pace = master.aggregated.pace
            master.spend = master.aggregated.spend
            master.cpa = master.aggregated.cpa
            master.conversions = master.aggregated.conversions
            master.planned_cpa = master.aggregated.planned_cpa
            master.planned_conversions = master.aggregated.planned_conversions
            master.tasks = master.tasks || 0
            master.onboarding = master.onboarding || 0
            master.spend_distance = master.spend === 0 ? 0 : Math.round(master.aggregated.spend_distance)
            master.cpa_distance = master.cpa === 0 ? 0 : Math.round(master.aggregated.cpa_distance)
            master.conversions_distance = master.conversions === 0 ? 0 : Math.round(master.aggregated.conversions_distance)
          } else {
            master.budget = this.getAggregatedData(master, 'budget')
            master.pace = this.getAggregatedData(master, 'pace')
            master.spend = this.getAggregatedData(master, 'spend')
            master.cpa = this.getAggregatedData(master, 'cpa')
            master.conversions = this.getAggregatedData(master, 'conversions')
            master.planned_cpa = this.getAggregatedData(master, 'planned_cpa')
            master.planned_conversions = this.getAggregatedData(master, 'planned_conversions')
            master.clients.forEach((client) => {
              client.toggle = !!this.toggleSocFilters
              client.pace = client.aggregated.pace
              client.budget = client.aggregated.budget
              client.spend = client.aggregated.spend
              client.conversions = client.aggregated.conversions
              client.cpa = client.aggregated.cpa
              client.spend_distance = client.spend === 0 ? 0 : Math.round(client.aggregated.spend_distance)
              client.cpa_distance = client.cpa === 0 ? 0 : Math.round(client.aggregated.cpa_distance)
              client.conversions_distance = client.conversions === 0 ? 0 : Math.round(client.aggregated.conversions_distance)
            })
          }
        })
        // sort client-table
        let sortBy = this.getSortByFunction()
        clientList.forEach((master) => {
          master.clients ? master.clients = master.clients.sort(sortBy) : false
        })
        clientList = clientList.sort(sortBy)

        // change direction
        if (!this.sortDirectionDown) {
          clientList.forEach((master) => {
            master.clients ? master.clients = master.clients.reverse() : false
          })
          clientList.reverse()
        }
        return clientList
      }
    },
    created () {
      this.signIn()
      this.auth()
    }
  }
</script>

<style scoped>
@import "../../assets/dashboard.css";

select.form-control.custom-select {
  display: inline-block;
  width: 100% !important;
  height: 100% !important;
}
</style>
