<template>
  <transition name='fade'>
    <tr class="ads-row" v-if='isShowRow(client)'>
      <td class="client-icon">
        <img v-show="typeRow === 'googleadwords' && bigLogo !== '1'" src="../../../assets/img/googleadwords.png" alt="" height="25">
        <img v-show="typeRow === 'googleadwords' && bigLogo === '1'" src="../../../assets/img/googleLogo.png" alt="" height="25">
        <img v-show="typeRow === 'bing' && bigLogo !== '1'" src="../../../assets/img/bing.png" alt="" height="25">
        <img v-show="typeRow === 'bing' && bigLogo === '1'" src="../../../assets/img/bingLogo.png" alt="" height="25">
        <img v-show="typeRow === 'fb' && bigLogo !== '1'" src="../../../assets/img/fb.png" alt="" height="25">
        <img v-show="typeRow === 'fb' && bigLogo === '1'" src="../../../assets/img/facebookLogo.png" alt="" height="25">
      </td>
      <td class="client-icon-img" :class='customClass(client.budget)'>        
        {{makeComa(client.budget, '$', true)}}</td>
      <td :class='customClass(client.pace)'>{{makeComa(client.pace, '$', true)}}</td>
      <td :class='customClass(client.spend)'>{{makeComa(client.spend, '$', true)}}</td>
      <td class="pers" :class='client.spendPers >= 0 ? "text-success" : "text-danger"'>
        {{makeComa(client.spend_distance, '%', true)}}
      </td>
      <td :class='customClass(client.conversions)'>{{makeComa(client.conversions)}}</td>
      <td v-show='client.planned_conversions !== 0' class="pers"
          :class='client.conversions >= 0 ? "text-success" : "text-danger"'>
        {{makeComa(client.conversions_distance, '%', true)}}
      </td>
      <td :class='customClass(client.cpa)'>{{customizeCpa(client.cpa, '$')}}</td>
      <td class="pers" :class='client.spendPers >= 0 ? "text-success" : "text-danger"'>
        {{client.cpa_distance === 0 ? '' : customizeCpaPer(client.cpa_distance, '%')}}
      </td>
<!--       <td class="tasks" :class='customClass(client.tasks)'>{{makeComa(client.tasks)}}</td>
      <td class="onboarding" :class='customClass(client.onboarding)'>
        <span>{{makeComa(client.onboarding)}}</span>
      </td> -->
    </tr>
  </transition>
</template>

<script>
  export default {
    name: 'ads-row',
    props: ['client', 'typeRow', 'bigLogo'],
    data () {
      return {}
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
      isShowRow (client) {
        return client.budget || client.pace || client.conversions || client.cpa || client.spend
      },
      customClass (val) {
        if (!val) return 'invalid-num'
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
      }
    }
  }
</script>

<style scoped>
  img {
    height: 25px;
  }
  .invalid-num {
    color: #d3d3d3d3;
  }
  .ads-row {
    border: none;
  }
  .ads-row td{
    border-bottom: 1px solid #d7d7d7;
  }
  .ads-row td.client-icon{
    border-bottom: none;
    padding: 3px 40px;
  }
  .ads-row td.client-icon-img {
    /*display: flex;
    align-items: center;
    justify-content: space-between;*/
  }
  .tasks.invalid-num, .onboarding.invalid-num, .tasks.invalid-num a {
    text-align: center !important;
    color: #d3d3d3d3;
  }

</style>
