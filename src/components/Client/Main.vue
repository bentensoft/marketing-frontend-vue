<template>
  <b-row class="client-page main-dashboard">
    <b-col cols='12'>
      <h2>{{client.name}} Account Performance</h2>
    </b-col>
    <b-col cols='2'>
      <b-form-select v-model="timeframe" @input='updateAds()' :options="date" class="mb-3"></b-form-select>
    </b-col>
    <b-col cols='12'>
      <table class="masters">
        <tr class="head header-table">
          <th></th> <!-- this is for ad logo -->
          <template v-for="filter in typeFiltersList">
            <th :class="filter.class ? filter.name : ''">
              {{filter.fullName}}
            </th>
          </template>
        </tr>
        <tbody>
        <!-- <ClientRow v-show="client.adwords" :client="client"></ClientRow> -->
        <AdsRow v-show="client.adwords" :client="client.adwords" typeRow="googleadwords" bigLogo="1"></AdsRow>
        <AdsRow v-show="client.bingads" :client="client.bingads" typeRow="bing" bigLogo="1"></AdsRow>
        <AdsRow v-show="client.facebookads" :client="client.facebookads" typeRow="fb" bigLogo="1"></AdsRow>
        </tbody>
      </table>
    </b-col>
  </b-row>
</template>

<script>
import AdsRow from '../Dashboard/Components/DashboardAdsRow.vue'
import ClientRow from '../Dashboard/Components/DashboardClientRow'

export default {
  name: 'main-dashboard',
  data () {
    return {
      typeFiltersList: [
        // {
        //   name: 'name',
        //   fullName: 'Client name',
        //   class: true
        // },
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
        }
        // {
        //   name: 'tasks',
        //   fullName: 'Tasks'
        // },
        // {
        //   name: 'onboarding',
        //   fullName: 'Onboarding',
        //   class: true
        // }
      ],
      timeframe: '',
      date: [],
      ads: null,
      showModalTask: false,
      max: 100,
      client: {},
      tasks: []
    }
  },
  components: {
    AdsRow,
    ClientRow
  },
  methods: {
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
    updateAds () {
      this.axios.get(
        this.newApiProperty + '/api/clients/' + this.$route.params.id + '/?timeframe=' + this.timeframe,
        this.configWithCredentials
      ).then((resp) => {
        this.client = resp.data
      })
    }
  },
  created () {
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

    this.updateAds()
  }
}
</script>

<style scoped>

@import "../../assets/dashboard.css";


.client-page {
  max-width: 1280px;
  margin: 0 auto;
}

  .masters {
    width: 100%;
  }
</style>
