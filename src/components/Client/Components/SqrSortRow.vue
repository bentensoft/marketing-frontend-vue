<template class="sort-row">
  <tr>
    <template v-if='tableType === "active"'>
      <th class="column-with-btn icon-follow"><b-button block @click='addExcludeActivate("all", "added")' variant='success'><i class="fa fa-plus" aria-hidden="true"></i> All</b-button></th>
      <th  class="column-with-btn icon-follow"><b-button block @click='addExcludeActivate("all", "excluded")' variant='danger'><i class="fa fa-trash" aria-hidden="true"></i> All</b-button></th>
      <th class="icon-follow column-with-btn"><b-button block @click='addExcludeActivate("all", "followup")' variant='info'><i class="fa fa-arrow-circle-right" aria-hidden="true"></i> All</b-button></th>
    </template>
    <template v-else>
      <!--<th  class='width-8 text-align-left'>Select</th>-->
      <th class='width-8 text-align-left'>Author</th>
      <th class='width-8 text-align-left' >Modified</th>
    </template>
    <th :colspan="columnWidthTermCell" class="text-align-left" style="width: 22.7%"  @click='sort === "term" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "term";  filterTable()'>
      Display name
      <i v-if='sort === "term"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "impressions" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "impressions";  filterTable()'>
      Impr.
      <i v-if='sort === "impressions"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th @click='sort === "clicks" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "clicks"; filterTable()'>
      Clicks
      <i v-if='sort === "clicks"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "cpc" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "cpc"; filterTable()'>
      CPC
      <i v-if='sort === "cpc"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "ctr" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sort = "ctr"; filterTable()'>
      CTR
      <i v-if='sort === "ctr"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "cost" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sort = "cost"; filterTable()'>
      Cost
      <i v-if='sort === "cost"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "conversions" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sort = "conversions"; filterTable()'>
      Conv.
      <i v-if='sort === "conversions"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th  @click='sort === "cpa" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false; sort = "cpa"; filterTable()'>
      CPA
      <i v-if='sort === "cpa"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
    </th>
    <th :style='{width: tableType === "active" ? "7.5%" : "9%"}' class="align-right ghost-cell-parent"  style="position: relative">
         <span class="ghost-cell"  v-if="indexFilter === ''">
            Index
            </span>
      <b-form-select class="index-filter mb-3"
                     style="position: relative; max-width: 100%;"
                     @input='sortDirectionDown = true;
                         sort = indexFilter; filterTable()'
                     v-model="indexFilter"
                     :options="[{ value: 'increase_ctr', text: 'Increase CTR' },{ value: 'cut_down_costs', text: 'Cut down Costs' },]" />

    </th>
    <template>
      <th style="width: 9.5%;" v-if='tableType !== "active"' >
        Actions
      </th>
    </template>
  </tr>
</template>

<script>

export default {
  name: 'sort-row',
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
