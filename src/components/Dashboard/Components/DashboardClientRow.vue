<template class="client-row">
  <tr class="master">
    <template>
      <td class="client_name_blue clientName title" :title="client.name">
        <span>{{client.name}}</span>
        <b-button class='edit-btn' v-b-modal.edit-client size='sm'
                  @click='changeClientModalId(client.customer_id, $event)' variant='link'>
          <i class="fa fa-pencil" aria-hidden="true"></i>
        </b-button>
      </td>
      <td>{{makeComa(client.aggregated.budget, '$', true)}}</td>
      <td>{{makeComa(client.aggregated.pace, '$', true)}}</td>
      <td>{{makeComa(client.aggregated.spend, '$', true)}}</td>
      <td class="pers"
          :class='client.aggregated.spend_distance >= 0 ? "text-success" : "text-danger"'>
        {{client.spend === 0 ? '' : makeComa(client.aggregated.spend_distance, '%', true)}}
      </td>
      <td>{{makeComa(client.aggregated.conversions)}} </td>
      <td class="pers"
          :class='client.aggregated.conversions >= 0 ? "text-success" : "text-danger"'>
        {{client.aggregated.planned_conversions === 0 ? '' : makeComa(client.aggregated.conversions_distance, '%')}}
      </td>
      <td>{{makeComa(client.aggregated.cpa_distance, '$')}}  </td>
      <td class="pers"
          :class='client.aggregated.spendPers >= 0 ? "text-success" : "text-danger"'>
        {{client.aggregated.planned_cpa === 0 ? '' : makeComa(client.aggregated.cpa_distance, '%')}}
      </td>
<!--       <td>{{makeComa(client.tasks)}}</td>
      <td>
        <span>{{makeComa(client.onboarding)}}</span>
      </td> -->
    </template>
  </tr>
</template>

<script>

export default {
  name: 'client-row',
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
    }
  }
}
</script>
