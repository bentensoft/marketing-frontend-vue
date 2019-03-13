<template class="inner-clients">
  <transition name='fade'>
  <tr class="client" v-show='client.searchShow'>
      <td class="client_name_blue masterName title" :title="client.name">
        <i  @click='client.toggle = !client.toggle' :class='client.toggle ? "rotate" : ""' class="arrow">
          <svg viewBox="0 0 17 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-arrow-right">
            <title>1178</title>
            <defs></defs>
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path d="M6.077,1.162 C6.077,1.387 6.139,1.612 6.273,1.812 L10.429,8.041 L6.232,14.078 C5.873,14.619 6.019,15.348 6.56,15.707 C7.099,16.068 7.831,15.922 8.19,15.382 L12.82,8.694 C13.084,8.3 13.086,7.786 12.822,7.39 L8.233,0.51 C7.873,-0.032 7.141,-0.178 6.601,0.181 C6.26,0.409 6.077,0.782 6.077,1.162 L6.077,1.162 Z" fill="#434343" class="si-glyph-fill"></path>
            </g>
          </svg>
        </i>
        <router-link :to='{name: "Client Main", params: {id: client.customer_id}}'>{{client.name}}</router-link>
        <b-button class='edit-btn' v-b-modal.edit-client size='sm' @click='changeClientModalId(client.customer_id, $event)' variant='link'>
          <i class="fa fa-pencil"></i>
        </b-button>
      </td>
      <td :class='customClass(client.budget)'>{{makeComa(client.budget, '$', true)}}</td>
      <td :class='customClass(client.pace)'>{{makeComa(client.pace, '$', true)}}</td>
      <td :class='customClass(client.spend)'>{{makeComa(client.spend, '$', true)}}</td>
      <td class="pers" :class='client.spendPers >= 0 ? "text-success" : "text-danger"'>
        {{makeComa(client.spendPers, '%', true)}}
      </td>
      <td :class='customClass(client.conversions)'>{{makeComa(client.conversions)}}</td>
      <td class="pers" :class='client.conversions >= 0 ? "text-success" : "text-danger"'>
        {{makeComa(client.conversionsPers, '%')}}</td>
      <td :class='customClass(client.cpa)'>{{makeComa(client.cpa, '$')}}
      </td>
      <td class="pers" :class='client.spendPers >= 0 ? "text-success" : "text-danger"'>{{makeComa(client.cpaPers, '%')}}</td>
      <td class="tasks" :class='customClass(client.tasks)'>
        <router-link :to='{name: "Client Tasks", params: {id: client.customer_id}}'>
          {{makeComa(client.tasks)}}
        </router-link>
      </td>
      <td class="onboarding" :class='customClass(client.onboarding)'>
        <span>{{makeComa(client.onboarding)}}</span>
      </td>
    </tr>
  </transition>
</template>

<script>

export default {
  name: 'inner-clients',
  props: ['client'],
  data () {
    return {

    }
  },
  components: {
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
    changeClientModalId (val, event) {
      this.$emit('changeClientModalId', val, event)
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
