<template class='sqr-total'>
  <table class="panel table table-bordered">
      <tr>
        <th></th>
        <th class="align-right">Impr.</th>
        <th class="align-right">Clicks</th>
        <th class="align-right">CPC</th>
        <th class="align-right">CTR</th>
        <th class="align-right">Cost</th>
        <th class="align-right">Conv.</th>
        <th class="align-right">CPA</th>
        <th class="align-right">Count</th>
      </tr>
      <tr class="account-total-row">
        <td>Account Total</td>
        <td class="align-right">{{makeComa(accountTotal.impressions)}}</td>
        <td class="align-right">{{makeComa(accountTotal.clicks)}}</td>
        <td class="align-right">{{makeComa(accountTotal.cpc, '$')}}</td>
        <td class="align-right">{{makeComa(accountTotal.ctr, '%')}}</td>
        <td class="align-right">{{makeComa(accountTotal.cost, '$')}}</td>
        <td class="align-right">{{makeComa(accountTotal.conversions)}}</td>
        <td class="align-right">{{makeComa(accountTotal.cpa, '$')}}</td>
        <td class="align-right">{{makeComa(accountTotal.count)}}</td>
      </tr>
      <tr v-if="added_total" class="account-total-row">
        <td>Added total</td>
        <td class="align-right">{{makeComa(added_total.impressions)}}</td>
        <td class="align-right">{{makeComa(added_total.clicks)}}</td>
        <td class="align-right">{{makeComa(added_total.cpc, '$')}}</td>
        <td class="align-right">{{makeComa(added_total.ctr, '%')}}</td>
        <td class="align-right">{{makeComa(added_total.cost, '$')}}</td>
        <td class="align-right">{{makeComa(added_total.conversions)}}</td>
        <td class="align-right">{{makeComa(added_total.cpa, '$')}}</td>
        <td class="align-right">{{makeComa(added_total.count)}}</td>
      </tr>
      <tr v-if="excluded_total" class="account-total-row">
        <td>Excluded Total</td>
        <td class="align-right">{{makeComa(excluded_total.impressions)}}</td>
        <td class="align-right">{{makeComa(excluded_total.clicks)}}</td>
        <td class="align-right">{{makeComa(excluded_total.cpc, '$')}}</td>
        <td class="align-right">{{makeComa(excluded_total.ctr, '%')}}</td>
        <td class="align-right">{{makeComa(excluded_total.cost, '$')}}</td>
        <td class="align-right">{{makeComa(excluded_total.conversions)}}</td>
        <td class="align-right">{{makeComa(excluded_total.cpa, '$')}}</td>
        <td class="align-right">{{makeComa(excluded_total.count)}}</td>
      </tr>
      <tr v-if="follow_up_total" class="account-total-row">
        <td>Follow up Total</td>
        <td class="align-right">{{makeComa(follow_up_total.impressions)}}</td>
        <td class="align-right">{{makeComa(follow_up_total.clicks)}}</td>
        <td class="align-right">{{makeComa(follow_up_total.cpc, '$')}}</td>
        <td class="align-right">{{makeComa(follow_up_total.ctr, '%')}}</td>
        <td class="align-right">{{makeComa(follow_up_total.cost, '$')}}</td>
        <td class="align-right">{{makeComa(follow_up_total.conversions)}}</td>
        <td class="align-right">{{makeComa(follow_up_total.cpa, '$')}}</td>
        <td class="align-right">{{makeComa(follow_up_total.count)}}</td>
      </tr>
      <tr>
        <td>Dataset Total</td>
        <td class="align-right">{{makeComa(datasetTotal.impressions)}}</td>
        <td class="align-right">{{makeComa(datasetTotal.clicks)}}</td>
        <td class="align-right">{{makeComa(datasetTotal.cpc, '$')}}</td>
        <td class="align-right">{{makeComa(datasetTotal.ctr, '%')}}</td>
        <td class="align-right">{{makeComa(datasetTotal.cost, '$')}}</td>
        <td class="align-right">{{makeComa(datasetTotal.conversions)}}</td>
        <td class="align-right">{{makeComa(datasetTotal.cpa, '$')}}</td>
        <td class="align-right">{{makeComa(datasetTotal.count)}}</td>
      </tr>
  </table>
</template>

<script>
export default {
  name: 'sqr-total',
  props: ['isShort'],
  data () {
    return {
      empty: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0
      },
      accountTotal: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0
      },
      datasetTotal: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0
      },
      added_total: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0
      },
      excluded_total: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0
      },
      follow_up_total: {},
      totals: []
    }
  },
  methods: {
    makeComa (val, sign) {
      if (sign === 'percent' && (!val || val === 0 || val === null)) return ''
      if (!val || val === 0 || val === null) return '-'
      else {
        if (val.toString().indexOf('.') > -1) {
          val = parseFloat(val).toFixed(2)
        }
        val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        if (sign) {
          return sign === '$' ? sign + '' + val : val + '%'
        }
        return val
      }
    }
  },
  created: function () {
    let self = this
    document.addEventListener('setAllTotals', function (e) {
      let totals = JSON.parse(e.detail)
      self.accountTotal = totals[0] || this.empty
      self.datasetTotal = totals[1] || this.empty
      self.added_total = totals[2] || this.empty
      self.excluded_total = totals[3] || this.empty
      self.follow_up_total = totals[4] || this.empty
    })
  }
}
</script>

<style scoped>
   input {
    width: 100%;
    height: 30px;
    max-width: 250px;
    display: inline-block;
  }

  table i {
    font-size: 13px;
  }

  td p{
    margin: 0;
  }

  .table th, .table td {
    padding: 5px;
  }

  .table td button,
  .table th button {
    width: 100%;
    padding: 0;
  }

  .panel {
    margin-bottom: 0;
  }

  .table th{
    font-size: 18px;
    word-break: break-word;
    cursor: pointer;
  }

  .tags span{
    display: inline-block;
    padding: 2px 4px;
    border: 1px solid #bbb;
    border-radius: 5px;
    color: #666;
  }
  .table,
  .table .btn{
    font-size: 14px;
  }

  .table .date{
    font-size: 14px;
  }

  .panel th:first-child,
  .panel td:first-child{
    width: 40%;
  }
  .panel td:nth-child(2),
  .panel td,
  .panel th:nth-child(2),
  .panel th{
    width: 7.5%;
  }
  .panel td:last-child,
  .panel th:last-child{
    width: 15%;
  }

  @media (max-width: 1280px) {
    .table th{
      font-size: 16px;
    }
  }

  .align-right {
    text-align: right;
  }


</style>
