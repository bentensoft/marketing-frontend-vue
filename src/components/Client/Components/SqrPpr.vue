<template>
  <div id='table-top'>
    <b-row class='mt-4 mb-4'>
      <UploadCsv @updateInfo='updateSqrTable("active")' v-if='isCustom'></UploadCsv>
      <b-col>
        <b-btn
         @click='changeTab("active"); showedTable = activeTable'
         block
         :disabled='isActiveDisabled'
         :variant='tableType === "active" ? "primary" : "secondary"'>{{isPpr !== undefined ? 'Placement' : 'SQR'}} Data <span class="length">{{makeComaShort(activeCount)}}</span></b-btn>
      </b-col>
      <b-col>
        <b-btn
         id="added-btn"
         @click='changeTab("added")'
         block
         :disabled='isAddedDisabled'
         :variant='tableType === "added" ? "primary" : "secondary"'>Added <span class="length">{{makeComaShort(addedCount)}}</span></b-btn>
      </b-col>
      <b-col>
        <b-btn
         @click='changeTab("excluded")'
         block
         :disabled='isExcludedDisabled'
         :variant='tableType === "excluded" ? "primary" : "secondary"'>Excluded <span class="length">{{makeComaShort(excludedCount)}}</span></b-btn>
      </b-col>
      <b-col>
        <b-btn
         @click='changeTab("followup")'
         block
         :disabled='isFollowDisabled'
         :variant='tableType === "followup" ? "primary" : "secondary"'>Follow Up <span class="length">{{makeComaShort(followCount)}}</span></b-btn>
      </b-col>
    </b-row>
    <table class="panel table sqr-table-aligned table-bordered">
      <tr>
        <th :class="isLoading ? 'yellow-bg' : ''" :colspan="columnWidthFirstCell" class="text-align-left">
          <transition v-if='isLoading' name='fade'>
            <p style="margin: 0" class="ml-1"><b>{{loadingText}}</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
          </transition>
        </th>
        <th >Impr.</th>
        <th >Clicks</th>
        <th >CPC</th>
        <th >CTR</th>
        <th >Cost</th>
        <th >Conv.</th>
        <th >CPA</th>
        <th :colspan="columnWidthCountCell" :class="this.tableType === 'active' ? 'width-7' : 'width-15'">Count</th>
      </tr>
      <tr class="account-total-row">
        <td  :colspan="columnWidthFirstCell" class="text-align-left">Account Total</td>
        <td>{{makeComa(accountTotal.impressions)}}</td>
        <td>{{makeComa(accountTotal.clicks)}}</td>
        <td>{{makeComa(accountTotal.cpc, '$')}}</td>
        <td>{{makeComa(accountTotal.ctr, '%')}}</td>
        <td>{{makeComa(accountTotal.cost, '$')}}</td>
        <td>{{makeComa(accountTotal.conversions)}}</td>
        <td>{{makeComa(accountTotal.cpa, '$')}}</td>
        <td :colspan="columnWidthCountCell" :class="this.tableType === 'active' ? 'width-7' : 'width-15'">
          {{makeComa(countOfRowsAccount)}}
        </td>
      </tr>
      <tr>
        <td :colspan="columnWidthFirstCell" class="text-align-left">Dataset Total</td>
        <td>
          {{makeComa(datasetTotal.impressions)}}
          <span class="pers">{{getPercForDataset('impressions')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.clicks)}}
          <span class="pers">{{getPercForDataset('clicks')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.cpc, '$')}}
          <span :class="getColorForDataset('cpc') ? 'red-font' : 'green-font'"
                class="pers">{{getPercForDataset('cpc')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.ctr, '%')}}
          <span :class="getColorForDataset('ctr') ? 'green-font' : 'red-font' " class="pers">{{getPercForDataset('ctr')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.cost, '$')}}
          <span class="pers">{{getPercForDataset('cost')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.conversions)}}
          <span class="pers">{{getPercForDataset('conversions')}}</span>
        </td>
        <td>{{makeComa(datasetTotal.cpa, '$')}}
          <span :class="getColorForDataset('cpa') ? 'red-font' : 'green-font'"
                class="pers">{{getPercForDataset('cpa')}}</span>
        </td>
        <td :colspan="columnWidthCountCell" :class="this.tableType === 'active' ? 'width-7' : 'width-15'">
          {{makeComa(countOfRowsDataset)}}
        </td>
      </tr>
      <tr class="search-row">
        <td :colspan="columnWidthFirstCell" class="text-align-left">
          <div v-if='isPpr === undefined' class="tags">
            <span v-if='tags.country'>Country <i @click='tags.country = false;updateSqrTable()' class="fa fa-times"
                                                 aria-hidden="true"></i></span>
            <span v-if='tags.state'>State <i @click='tags.state = false;updateSqrTable()' class="fa fa-times"
                                             aria-hidden="true"></i></span>
            <span v-if='tags.city'>City <i @click='tags.city = false;updateSqrTable()' class="fa fa-times"
                                           aria-hidden="true"></i></span>
          </div>
          <b-form-input v-model.trim="searchStore[tableType]" @input='searchData()' type='text'
                        placeholder='Search'></b-form-input>
          <b-dropdown v-if='isPpr === undefined' text="" variant="secondary" class="m-2">
            <b-dropdown-item :class='tags.country ? "active" : ""'
                             @click='tags.country = !tags.country;updateSqrTable()'>Country
            </b-dropdown-item>
            <b-dropdown-item :class='tags.state ? "active" : ""' @click='tags.state = !tags.state;updateSqrTable()'>USA
              State
            </b-dropdown-item>
            <b-dropdown-item :class='tags.city ? "active" : ""' @click='tags.city = !tags.city;updateSqrTable()'>USA
              City
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown v-if='isPpr === undefined' text="" variant="secondary" class="timeframe">
            <b-dropdown-item :class='timeframe === "YESTERDAY" ? "active" : ""' @click='timeframeChange("YESTERDAY")'>1
              day
            </b-dropdown-item>
            <b-dropdown-item :class='timeframe === "LAST_7_DAYS" ? "active" : ""'
                             @click='timeframeChange("LAST_7_DAYS")'>7 days
            </b-dropdown-item>
            <b-dropdown-item :class='timeframe === "LAST_14_DAYS" ? "active" : ""'
                             @click='timeframeChange("LAST_14_DAYS")'>14 days
            </b-dropdown-item>
            <b-dropdown-item :class='timeframe === "LAST_30_DAYS" ? "active" : ""'
                             @click='timeframeChange("LAST_30_DAYS")'>30 days
            </b-dropdown-item>
            <b-dropdown-item :class='timeframe === "LAST_60_DAYS" ? "active" : ""'
                             @click='timeframeChange("LAST_60_DAYS")'>60 days
            </b-dropdown-item>
            <b-dropdown-item :class='timeframe === "ALL_TIME" ? "active" : ""' @click='timeframeChange("ALL_TIME")'>All
              time
            </b-dropdown-item>
          </b-dropdown>

          <b-button class='filter-chanel m-2' :variant='chanel.google ? "" : "disable-chanel"'
                    @click='chanel.google = !chanel.google;updateSqrTable()'>
            <img src="../../../assets/img/googleadwords.png" alt="">
          </b-button>
          <b-button class='filter-chanel filter-chanel-big m-2' :variant='chanel.bing ? "" : "disable-chanel"'
                    @click='chanel.bing = !chanel.bing;updateSqrTable()'>
            <img src="../../../assets/img/bing.png" alt="">
          </b-button>
          <template v-if='tableType === "added"'>
          </template>
        </td>
        <td>
          {{makeComa(searchTotal.impressions, null, true)}}
          <span class="pers" >{{makeComa(searchTotal.impressionsPers, '%', true)}}</span>
        </td>
        <td>
          {{makeComa(searchTotal.clicks, null, true)}}
          <span class="pers" >{{makeComa(searchTotal.clicksPers, '%', true)}}</span>
        </td>
        <td>
          {{makeComa(searchTotal.cpc, '$', true)}}
          <span :class="searchTotal.cpc > datasetTotal.cpc ? 'red-font' : 'green-font'" class="pers"
                >{{makeComa(searchTotal.cpcPers, '%', true)}}</span>
        </td>
        <td>
          {{makeComa(searchTotal.ctr, '%', true)}}
          <span :class="searchTotal.ctr < datasetTotal.ctr ? 'red-font' : 'green-font'" class="pers"
                >{{makeComa(searchTotal.ctrPers, '%', true)}}</span>
        </td>
        <td>
          {{makeComa(searchTotal.cost, '$', true)}}
          <span class="pers" >{{makeComa(searchTotal.costPers, '%', true)}}</span>
        </td>
        <td>{{makeComa(searchTotal.conversions, null, true)}} <span class="pers" >{{makeComa(searchTotal.conversionsPers, '%', true)}}</span>
        </td>
        <td>
          {{makeComa(searchTotal.cpa, '$', true)}}
          <span class="pers" :class="searchTotal.cpa < datasetTotal.cpa ? 'green-font' : 'red-font'"
                >
            {{makeComa(searchTotal.cpaPers, '%', true)}}
          </span>
        </td>
        <td :class="this.tableType === 'active' ? 'width-7' : 'width-15'" :colspan="columnWidthCountCell">
          {{makeComa(countOfRowsSearch, null, true)}}
        </td>
      </tr>
      <tr v-if='tableType === "active"' class='filters'>
        <th :colspan="columnWidthFirstCell">
          <!--<b-form-input v-model.trim="search" @input='updateNgram()' type='text' placeholder='Search'></b-form-input>-->
        </th>
        <th v-for="filter in filterVal">
          <b-form-select
            @input='filterTable()'
            v-model='filter.comparison'
            :options='comparison'>
          </b-form-select>
          <b-form-input
            @input='validateFilterVal();filterTable()'
            v-model.trim="filter.value"
            type="text">
          </b-form-input>
        </th>
        <th>
          <button class="reset-btn" @click="resetFilters()">Reset</button>
        </th>
      </tr>
      <tr>
        <template v-if='tableType === "active"'>
          <th class="column-with-btn icon-follow"><b-button block @click='addExcludeActivate("all", "added")' variant='success'><i class="fa fa-plus" aria-hidden="true"></i> All</b-button></th>
          <th  class="column-with-btn icon-follow"><b-button block @click='addExcludeActivate("all", "excluded")' variant='danger'><i class="fa fa-trash" aria-hidden="true"></i> All</b-button></th>
          <th class="icon-follow column-with-btn"><b-button block @click='addExcludeActivate("all", "followup")' variant='info'><i class="fa fa-arrow-circle-right" aria-hidden="true"></i> All</b-button></th>
        </template>
        <th :colspan="columnWidthTermCell" class="text-align-left" style="width: 22.7%"  @click='sort === "term" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "term";  filterTable()'>
           {{isPpr !== undefined ? 'Display name' : 'Term'}}
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
        <template v-if='tableType !== "active"'>
          <th class='width-8'>Actions</th>
          <th class='width-8'>Author</th>
          <th class='width-8' >Modified</th>
        </template>
      </tr>
      <tr :class="sqr.type === 'excluded' ? 'red-row' : sqr.type === 'added' ? 'green-row' : ''" v-for='(sqr, index) in showedTable' :key="index">
        <template v-if='tableType !== "active"'>
          <!--<td>-->
          <!--</td>-->
        </template>
        <template v-if='tableType === "active"'>
          <td class="text-center column-with-btn icon-follow">
            <b-button :disabled="sqr.type !== 'active'" @click='addExcludeActivate(sqr.id, "added", index)' variant='success'><i class="fa fa-plus" aria-hidden="true"></i></b-button></td>
          <td class="text-center column-with-btn icon-follow">
            <b-button :disabled="sqr.type !== 'active'"  @click='addExcludeActivate(sqr.id, "excluded", index)' variant='danger'><i class="fa fa-trash" aria-hidden="true"></i></b-button></td>
          <td class="text-center column-with-btn icon-follow">
            <b-button :disabled="sqr.type !== 'active'"  @click='addExcludeActivate(sqr.id, "followup", index)' variant='info'><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></b-button></td>
        </template>
        <td :colspan="columnWidthTermCell" class="term text-align-left">
          <span>{{isPpr !== undefined ? sqr.placement : sqr.term}}</span>
          <b-button v-if="sqr.term" class='glass-btn' size='sm'
                    @click='findInGoogle(sqr.term)' variant='link'>
            <i class="fa fa-search" aria-hidden="true"></i>
          </b-button>
          <b-button v-if="sqr.term && client.siteurl" class='glass-btn text-success' size='sm'
                    @click='findInGoogleImplicit(sqr.term)' variant='link'>
            <i class="fa fa-search" aria-hidden="true"></i>
          </b-button>
          <b-button v-if="sqr.site" class='glass-btn' size='sm'
                    @click='findInGoogleSite(sqr.term, sqr.site)' variant='link'>
            <i class="fa fa-google" aria-hidden="true"></i>
          </b-button>
        </td>
        <td>{{sqr.impressions === 0 ? '-' : makeComa(sqr.impressions)}}</td>
        <td>{{sqr.clicks ? makeComa(sqr.clicks) : '-'}}</td>
        <td>{{sqr.cpc ? makeComa(sqr.cpc,  '$')  : '-'}}</td>
        <td>{{sqr.ctr ? sqr.ctr + '%' : '-'}}</td>
        <td>{{sqr.cost ? makeComa(sqr.cost, '$') : '-'}}</td>
        <td>{{sqr.conversions ? sqr.conversions : '-'}}</td>
        <td>{{sqr.cpa ? makeComa(sqr.cpa, '$') : '-'}}</td>
        <td>{{makeComa(sqr.index)}}</td>
        <template v-if='tableType !== "active"' >
        <td>
          <b-button class="adwords-btn" @click='addExcludeActivate(sqr.id, tableType, index, true)'>
            <img src="../../../assets/img/googleadwords.png" alt="">
          </b-button>
          <b-button  class="undo-btn" @click='addExcludeActivate(sqr.id, tableType, index, true)'>Undo</b-button>
        </td>
        <td>
          <p>{{sqr.author.username ? sqr.author.username : ''}}</p>
        </td>
        <td class="date" v-b-tooltip.hover='sqr.modified.slice(11)'>
          {{formatModified(sqr.modified)}}
        </td>
        </template>
      </tr>
    </table>
    <b-pagination v-if='showedTable.length !== 0' align='right' size="sm" :total-rows="pagesLength" @change='goTop()' v-model="currentPage" :per-page="10"></b-pagination>
  </div>
</template>

<script>
import UploadCsv from './UploadCsv.vue'
import SqrModal from '../../Dashboard/Modal/SqrModal'
import SqrTotals from './SqrTotals'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Switches from 'vue-switches'

export default {
  name: 'SqrPprTable',
  model: {
    event: 'change'
  },
  props: {
    value: { type: String, default: 'all_time' },
    searchFromNgram: { type: String, default: '' },
    isPpr: Object
  },
  data () {
    return {
      is_show_all: false,
      loadingText: 'Loading',
      filterVal: {
        impressions: {value: '', comparison: '>'},
        click: {value: '', comparison: '>'},
        cpc: {value: '', comparison: '>'},
        ctr: {value: '', comparison: '>'},
        cost: {value: '', comparison: '>'},
        conversions: {value: '', comparison: '>'},
        cpa: {value: '', comparison: '>'}
      },
      tableTotal: {},
      indexFilter: '',
      searchStore: {
        'active': '',
        'added': '',
        'excluded': '',
        'followup': ''
      },
      prevTimeForSearch: 0,
      timeframe: this.value,
      lastAddedTimestamp: '',
      showedTable: [],
      activeTotal: [],
      activeDatasetTotal: [],
      addedTotal: [],
      showSqrModal: false,
      search: '',
      csvError: '',
      lastTableType: '',
      activeTable: [],
      addedTable: [],
      excludedTable: [],
      followTable: [],
      activeCount: 0,
      addedCount: 0,
      excludedCount: 0,
      followCount: 0,
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
      searchTotal: {
        clicks: 0,
        conversions: 0,
        cost: 0,
        cpa: 0,
        index: 0,
        ctr: 0,
        cpc: 0,
        impressions: 0,
        impressionsPers: 0,
        clicksPers: 0,
        conversionsPers: 0,
        cpcPers: 0,
        ctrPers: 0,
        costPers: 0,
        cpaPers: 0
      },
      tags: {
        country: false,
        state: false,
        city: false
      },
      comparison: [
        {value: '=', text: '='},
        {value: '>', text: '>'},
        {value: '<', text: '<'},
        {value: '<=', text: '≤'},
        {value: '>=', text: '≥'}
      ],
      chanel: {
        bing: true,
        google: true
      },
      countOfRowsAccount: '',
      countOfRowsDataset: '',
      countOfRowsSearch: '',
      timerPutAd: null,
      timerPutEx: null,
      timerPutFollow: null,
      arrayStringsForPutAd: [],
      arrayStringsForPutEx: [],
      arrayStringsForPutFollow: [],
      prevSearch: '',
      sort: 'i',
      sortDirectionDown: false,
      tableType: 'active',
      currentPage: 1,
      numberPage: 1,
      isLoading: true,
      counterForSearch: 0
    }
  },
  components: {
    UploadCsv,
    SqrModal,
    SqrTotals,
    Switches
  },
  methods: {
    getColorForDataset (column) {
      let perc = 100 - (this.datasetTotal[column] / this.accountTotal[column] * 100)
      return perc > this.accountTotal[column]
    },
    getPercForDataset (column) {
      let perc = 100 - (this.datasetTotal[column] / this.accountTotal[column] * 100)
      perc = this.makeComa(perc, '%')
      return this.datasetTotal[column] === 0 ? '' : perc
    },
    validateFilterVal () {
      for (var filter in this.filterVal) {
        var val = this.filterVal[filter].value
        if (+val < 0 || val === '' || val === '-') {
          this.filterVal[filter].value = ''
        }
      }
    },
    changeTab (status) {
      if (status !== 'active') {
        this.showedTable = []
      }
      if (this.searchStore[status] === this.searchStore[this.tableType]) {
        this.tableType = status
        this.updateSqrTable(true)
      } else {
        this.tableType = status
      }
    },
    resetFilters () {
      this.comparison = [
        {value: '=', text: '='},
        {value: '>', text: '>'},
        {value: '<', text: '<'},
        {value: '<=', text: '≤'},
        {value: '>=', text: '≥'}
      ]
      this.filterVal = {
        impressions: {value: '', comparison: '>'},
        click: {value: '', comparison: '>'},
        cpc: {value: '', comparison: '>'},
        ctr: {value: '', comparison: '>'},
        cost: {value: '', comparison: '>'},
        conversions: {value: '', comparison: '>'},
        cpa: {value: '', comparison: '>'}
      }
      this.searchStore = {
        'active': '',
        'added': '',
        'excluded': '',
        'followup': ''
      }
    },
    timeframeChange (tf) {
      this.timeframe = tf
      this.updateSqrTable()
      this.$emit('change', this.timeframe)
    },
    getFilters () {
      let impressionsFilter = this.filterVal.impressions.value !== '' ? 'impressions,' + (this.filterVal.impressions.comparison) + ',' + this.filterVal.impressions.value + ',' : ''
      let clickFilter = this.filterVal.click.value !== '' ? 'clicks,' + (this.filterVal.click.comparison) + ',' + this.filterVal.click.value + ',' : ''
      let ctrFilter = this.filterVal.ctr.value !== '' ? 'ctr,' + (this.filterVal.ctr.comparison) + ',' + this.filterVal.ctr.value + ',' : ''
      let cpcFilter = this.filterVal.cpc.value !== '' ? 'cpc,' + (this.filterVal.cpc.comparison) + ',' + this.filterVal.cpc.value + ',' : ''
      let costFilter = this.filterVal.cost.value !== '' ? 'cost,' + (this.filterVal.cost.comparison) + ',' + this.filterVal.cost.value + ',' : ''
      let conversionsFilter = this.filterVal.conversions.value !== '' ? 'conversions,' + (this.filterVal.conversions.comparison) + ',' + this.filterVal.conversions.value + ',' : ''
      let cpaFilter = this.filterVal.cpa.value !== '' ? 'cpa,' + (this.filterVal.cpa.comparison) + ',' + this.filterVal.cpa.value : ''

      return '&filter_by=' + impressionsFilter + clickFilter + cpcFilter + ctrFilter + costFilter + conversionsFilter + cpaFilter
    },
    goTop () {
      var needScroll = 0
      if (this.isPpr === undefined) {
        var ngram = document.getElementsByClassName('ngram')[0].offsetHeight
        var sqrH = document.getElementsByClassName('sqr-h')[0].offsetHeight
        var sqrPanel = document.getElementsByClassName('panel')[0].offsetHeight
        needScroll = ngram + sqrPanel + sqrH
      } else {
        needScroll = 0
      }
      window.scrollTo(0, needScroll)
    },
    searchData (isEmpty) {
      let timer = null
      const onComplete = (s) => {
        if (s === this.searchStore[this.tableType]) {
          this.filterTable()
          timer = null
        }
      }
      if (timer) {
        clearTimeout(timer)
      }
      this.searchStore[this.tableType] = isEmpty ? '' : this.searchStore[this.tableType]
      if (this.prevSearch !== this.searchStore[this.tableType]) {
        let s = this.searchStore[this.tableType]
        timer = setTimeout(() => { onComplete(s) }, 500)
        this.prevSearch = this.searchStore[this.tableType]
      }
    },
    fillTotal (data, isSearch) {
      let total = data
      total.clicks = parseInt(+total.clicks)
      total.conversions = parseInt(+total.conversions)
      total.cost = parseInt(+total.cost)
      total.cpa = total.cpa === null ? 0 : +total.cpa.toFixed(2)
      total.ctr = total.ctr === null ? 0 : +total.ctr.toFixed(2)
      total.cpc = total.cpc === null ? 0 : +total.cpc.toFixed(2)
      total.impressions = parseInt(+total.impressions)
      if (isSearch) {
        total.impressionsPers = 100 - (total.impressions / this.accountTotal.impressions * 100)
        total.clicksPers = 100 - (total.clicks / this.accountTotal.clicks * 100)
        total.conversionsPers = 100 - (total.conversions / this.accountTotal.conversions * 100)
        total.cpcPers = 100 - (total.cpc / this.accountTotal.cpc * 100)
        total.ctrPers = 100 - (total.ctr / this.accountTotal.ctr * 100)
        total.costPers = 100 - (total.cost / this.accountTotal.cost * 100)
        total.cpaPers = 100 - (total.cpa / this.accountTotal.cpa * 100)
      }
      for (let key in total) {
        if (total[key] !== total[key]) {
          total[key] = 0
        }
      }
      return total
    },
    fillAllTotals (data) {
      let totals = []
      this.countOfRowsAccount = data.account_total.count || 0
      this.countOfRowsDataset = data.dataset_total.count || 0
      this.countOfRowsSearch = data.search_total.count || 0
      this.accountTotal = this.fillTotal(data.account_total)
      this.datasetTotal = this.fillTotal(data.dataset_total)
      if (data.search_total && Object.keys(data.search_total).length > 0) {
        this.searchTotal = this.fillTotal(data.search_total, 'isSearch')
      }
      totals.push(this.accountTotal)
      totals.push(this.datasetTotal)
      data.added_total && Object.keys(data.added_total).length > 0 ? totals.push(this.fillTotal(data.added_total)) : null
      data.excluded_total && Object.keys(data.excluded_total).length > 0 ? totals.push(this.fillTotal(data.excluded_total)) : null
      data.followup_total && Object.keys(data.followup_total).length > 0 ? totals.push(this.fillTotal(data.followup_total)) : null
      let event = new CustomEvent('setAllTotals', { 'detail': JSON.stringify(totals) })
      document.dispatchEvent(event)
    },
    fillTable (response) {
      let status = this.tableType
      let formatTable = response.data.results
      this.fillAllTotals(response.data)
      formatTable.forEach((sqr) => {
        sqr.index = +sqr.index
        sqr.cpa = sqr.cpa === null ? 0 : +sqr.cpa.toFixed(2)
        sqr.ctr = sqr.ctr === null ? 0 : +sqr.ctr.toFixed(2)
        sqr.cpc = sqr.cpc === null ? 0 : +sqr.cpc.toFixed(2)
        sqr.conversions = parseInt(+sqr.conversions)
        sqr.cost = parseInt(+sqr.cost)
        sqr.clicks = parseInt(+sqr.clicks)
        sqr.impressions = parseInt(+sqr.impressions) || 0
        sqr.is_added = sqr.is_added ? true : 'added'
        sqr.type = sqr.type || 'active'
      })
      this.activeCount = response.data.sqr_total && response.data.sqr_total.count ? response.data.sqr_total.count : 0
      this.addedCount = response.data.added_total.count ? response.data.added_total.count : 0
      this.excludedCount = response.data.excluded_total.count ? response.data.excluded_total.count : 0
      this.followCount = response.data.followup_total.count ? response.data.followup_total.count : 0
      if (status === 'active') {
        this.activeTable = formatTable
        this.activeCount = response.data.dataset_total.count ? response.data.dataset_total.count : 0
      } else if (status === 'added') {
        this.addedTable = formatTable
        this.addedCount = response.data.dataset_total.count ? response.data.dataset_total.count : 0
      } else if (status === 'excluded') {
        this.excludedTable = formatTable
        this.excludedCount = response.data.dataset_total.count ? response.data.dataset_total.count : 0
      } else if (status === 'followCount') {
        this.followTable = formatTable
        this.followCount = response.data.dataset_total.count ? response.data.dataset_total.count : 0
      }
      this.showedTable = formatTable
    },
    makeComa (val, sign, isSearch) {
      if ((isSearch && this.searchStore[this.tableType] === '') || sign === 'percent' && (!val || val === 0 || val === null)) return ''
      if (!val || val === 0 || val === '0.00' || val === null) return '-'
      else {
        if (val.toString().indexOf('.') > -1) {
          if (val > 99 && val < 100) {
            val = (val + '').substr(0, 4)
          } else {
            val = parseFloat(val).toFixed(2)
          }
        }
        val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        if (sign) {
          return sign === '$' ? sign + '' + val : val + '%'
        }
        return val
      }
    },
    makeComaShort (val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    filterTable () {
      if (this.currentPage !== 1) {
        this.currentPage = 1
      } else {
        this.updateSqrTable()
      }
    },
    addExcludeActivate (id, status, index, isDeleted) {
      if (index === undefined) {
        if (status === 'added') {
          this.addedCount = this.addedCount + this.activeTable.length
          this.arrayStringsForPutAd = []
          this.arrayStringsForPutAd = this.showedTable.map((elem) => { return elem.term })
          clearTimeout(this.timerPutAd)
        } else if (status === 'excluded') {
          this.excludedCount = this.excludedCount + this.activeTable.length
          this.excludedTable.concat(this.showedTable)
          this.arrayStringsForPutEx = []
          this.arrayStringsForPutEx = this.showedTable.map((elem) => { return elem.term })
          clearTimeout(this.timerPutEx)
        } else {
          this.followCount = this.followCount + this.activeTable.length
          this.followTable.concat(this.showedTable)
          this.arrayStringsForPutFollow = []
          this.arrayStringsForPutFollow = this.showedTable.map((elem) => { return elem.term })
          clearTimeout(this.timerPutFollow)
        }
        this.activeCount = this.activeCount - this.activeTable.length
        this.activeTable = []
        this.showedTable = []
        this.sendKeywords(undefined, status, isDeleted)
      } else {
        if (status === 'added') {
          this.arrayStringsForPutAd.push(this.showedTable[index].term)
          this.showedTable.splice(index, 1)
          if (isDeleted) {
            this.addedCount--
            this.activeCount++
          } else {
            this.addedCount++
            this.activeCount--
          }
          clearTimeout(this.timerPutAd)
          this.timerPutAd = null
          this.timerPutAd = setTimeout(() => {
            this.sendKeywords(index, status, isDeleted)
          }, 1300)
        } else if (status === 'excluded') {
          this.arrayStringsForPutEx.push(this.showedTable[index].term)
          this.showedTable.splice(index, 1)
          if (isDeleted) {
            this.excludedCount--
            this.activeCount++
          } else {
            this.excludedCount++
            this.activeCount--
          }
          clearTimeout(this.timerPutEx)
          this.timerPutEx = null
          this.timerPutEx = setTimeout(() => {
            this.sendKeywords(index, status, isDeleted)
          }, 1300)
        } else {
          this.arrayStringsForPutFollow.push(this.showedTable[index].term)
          this.showedTable.splice(index, 1)
          if (isDeleted) {
            this.followCount--
            this.activeCount++
          } else {
            this.followCount++
            this.activeCount--
          }
          clearTimeout(this.timerPutFollow)
          this.timerPutFollow = null
          this.timerPutFollow = setTimeout(() => {
            this.sendKeywords(index, status, isDeleted)
          }, 1300)
        }
      }
    },
    sendKeywords (index, status, isDeleted) {
      let time = new Date().getTime()
      let type = ''
      let arrayForPut = []
      switch (status) {
        case 'added': type = 'added'; arrayForPut = this.arrayStringsForPutAd; break
        case 'excluded': type = 'excluded'; arrayForPut = this.arrayStringsForPutEx; break
        case 'followup': type = 'followup'; arrayForPut = this.arrayStringsForPutFollow; break
      }
      this.lastAddedTimestamp = time
      const searchQuery = '&q=' + this.searchStore[this.tableType] ? this.searchStore[this.tableType] : ''
      const timeframe = '&date_range=' + this.timeframe.toUpperCase()
      this.loadingText = 'Saving in server'
      this.isLoading = true
      const method = isDeleted ? 'post' : 'put'
      this.axios({
        method: method,
        url: this.newApiProperty + '/api/keywords/' + type + '/?' + searchQuery + timeframe,
        withCredentials: this.configWithCredentials.withCredentials,
        data: {
          customer_id: this.$route.params.id,
          keywords: arrayForPut,
          dummy: false,
          timestamp: this.lastAddedTimestamp
        }
      }).then((response) => {
        if (this.lastAddedTimestamp === response.data.timestamp) {
          this.lastAddedTimestamp = ''
          if (this.tableType === 'active') {
            this.loadingText = 'Refetching SQR after saving'
            this.updateSqrTable('active')
          } else {
            this.fillAllTotals(response.data)
            this.isLoading = false
            this.loadingText = 'Loading'
          }
        }
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        console.log(error.response)
        this.isLoading = false
      })
      this.arrayStringsForPutAd = []
      this.arrayStringsForPutEx = []
      this.arrayStringsForPutFollow = []
    },
    findInGoogleSite (term, site) {
      window.open('http://google.com/search?q=' + site + ' search ' + term)
    },
    findInGoogle (term) {
      window.open('http://google.com/search?q=' + term)
    },
    findInGoogleImplicit (term) {
      window.open('http://google.com/search?q=' + term + ' site:' + this.client.siteurl)
    },
    updateSqrTable (status) {
      let filters = this.tableType === 'active' ? this.getFilters() : ''
      let searchQuery = '&q=' + (this.searchStore[this.tableType] ? encodeURIComponent(this.searchStore[this.tableType]) : '')
      let timeframe = '&date_range=' + this.timeframe.toUpperCase()
      let page = '&page=' + this.numberPage
      let sortDirection = !this.sortDirectionDown ? '-' : ''
      let secondPartUrl = this.tableType === 'active' ? '/api/sqr' : ('/api/keywords/' + this.tableType + '/')
      let showAll = '&show_all=' + !this.is_show_all
      this.isLoading = true
      if (this.tableType !== 'active') {
        this.showedTable = []
      }
      this.axios.get(
        this.newApiProperty + secondPartUrl + '?customer_id=' + this.$route.params.id + '&dummy=false' + showAll + searchQuery + timeframe + page + '&sort_by=' + sortDirection + this.sort + filters,
        this.configWithCredentials
      ).then((response) => {
        if (response.data.search && this.searchStore[this.tableType] !== '') {
          if (response.data.search !== this.searchStore[this.tableType]) {
            return
          }
        }
        if (this.tableType === 'active') {
          this.showedTable = []
        }
        this.fillTable(response)
        this.loadingText = 'Loading'
        this.isLoading = false
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        console.log(error.response)
        this.loadingText = 'Loading'
        this.isLoading = false
      })
    },
    formatModified(modified) {
      return new Date(modified).toLocaleDateString('en-US');
    },
    handleScroll (event) {
      if (document.getElementsByClassName('sqr-table').length === 0) {
        return false
      }
      var needScroll = document.getElementsByClassName('sqr-table').length !== 0 ? document.getElementsByClassName('sqr-table')[0].offsetTop : 0
      var scrollTop = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
      if (needScroll < scrollTop) {
        document.getElementsByClassName('panel')[0].classList.add('fixed')
      } else {
        document.getElementsByClassName('panel')[0].classList.remove('fixed')
      }
    }
  },
  watch: {
    currentPage: function (newPage) {
      this.numberPage = newPage
      if (this.tableType === 'added') {
        this.updateSqrTable('added')
      } else if (this.tableType === 'active') {
        this.updateSqrTable('active')
      } else {
        this.updateSqrTable('excluded')
      }
    },
    searchFromNgram: function () {
      this.tableType = 'active'
      this.searchStore[this.tableType] = this.searchFromNgram
    }
  },
  computed: {
    client() {
      return this.$store.state.client
    },
    columnWidthFirstCell () {
      return this.tableType === 'active' ? 10 : 5
    },
    columnWidthTermCell () {
      return this.tableType === 'active' ? 7 : 3
    },
    columnWidthCountCell () {
      return this.tableType === 'active' ? 1 : 2
    },
    isCustom () {
      return this.$store.state.client.is_custom
    },
    pagesLength () {
      if (this.countOfRowsSearch) {
        return this.countOfRowsSearch === 0 ? 0 : Math.ceil(this.countOfRowsSearch / 10)
      } else if (this.tableType === 'active') {
        return this.activeCount === 0 ? 0 : Math.ceil(this.activeCount / 10)
      } else if (this.tableType === 'added') {
        return this.addedCount === 0 ? 0 : Math.ceil(this.addedCount / 10)
      } else if (this.tableType === 'excluded') {
        return this.excludedCount === 0 ? 0 : Math.ceil(this.excludedCount / 10)
      } else if (this.tableType === 'follow') {
        return this.followCount === 0 ? 0 : Math.ceil(this.followCount / 10)
      }
    },
    isActiveDisabled () {
      return this.tableType === 'active'
    },
    isAddedDisabled () {
      return this.isLoading || this.tableType === 'added'
    },
    isExcludedDisabled () {
      return this.isLoading || this.tableType === 'excluded'
    },
    isFollowDisabled () {
      return this.isLoading || this.tableType === 'follow'
    }
  },
  created () {
    this.updateSqrTable('active')
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
  .table td {
    vertical-align: middle !important;
  }

  .panel .btn-group.b-dropdown.dropdown button.btn{
    padding: 3px;
    padding-left: 30px;
    position: relative;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }

  .panel .btn-group.b-dropdown.dropdown button.btn:before{
      content: "\f0b0";
      font-family: FontAwesome;
      font-style: normal;
      font-weight: normal;
      text-decoration: inherit;
      color: #fff;
      font-size: 21px;
      position: absolute;
      top: 1px;
      left: 5px;
  }
  .panel .btn-group.b-dropdown.dropdown.timeframe button.btn:before{
      content: "\f017";
      font-family: FontAwesome;
      font-style: normal;
      font-weight: normal;
      text-decoration: inherit;
      color: #fff;
      font-size: 21px;
      position: absolute;
      top: 1px;
      left: 5px;
  }

  .term {
    cursor: pointer;
  }

  .glass-btn {
    cursor: pointer;
    opacity: 0;
    transition: .2s;
    padding-top: 0;
    padding-bottom: 0;
    display: inline-block !important;
    width: 20px !important;
  }

  .term:hover .glass-btn {
    opacity: 1;
  }

  .search-row td{
    height: 62px;
  }
  .width-7 {
    width: 7.5%;
  }

  .width-15 {
    width: 15% !important;
  }

  .adwords-btn {
    background: none;
    width: 30px !important;
  }

  .adwords-btn img {
    width: 22px !important;
  }

  .btn:focus {
    box-shadow: none!important;
  }

  .reset-btn {
    margin: 0% 0% 0;
    padding: 2px 2px 2px !important;
    background: #d9534f;
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 16px;
  }

  .ngram-panel tr th:first-child{
    width: 37%;
  }
  .ngram-panel tr th{
    width: 7.5%;
    text-align: right;
  }


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

  span.length{
    background-color: #E9ECEF;
    border-radius: 10px;
    color: #333;
    display: inline-block;
    padding: 3px 5px;
  }

  .table.fixed .account-total-row{
    display: none;
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

  i.rotate{
    display: inline-block;
    transform: rotate(180deg);
  }

  .table,
  .table .btn{
    font-size: 14px;
  }

  .table .date{
    font-size: 14px;
  }

  .sqr-table,
  .panel{
    table-layout: fixed;
  }


  .sqr-table.add-exc th:nth-child(3),
  .sqr-table.add-exc td:nth-child(3),
  .sqr-table.add-exc th:nth-child(1),
  .sqr-table.add-exc td:nth-child(1),
  .sqr-table.add-exc th:nth-child(2),
  .sqr-table.add-exc td:nth-child(2) {
    width: 4.9989%;
  }

  .sqr-table:not(.add-exc) th:nth-child(1),
  .sqr-table:not(.add-exc) td:nth-child(1),
  .sqr-table:not(.add-exc) th:nth-child(2),
  .sqr-table:not(.add-exc) td:nth-child(2) {
    vertical-align: middle;
    padding: 2px;
    width: 3.3%;
  }

  .icon-follow {
    vertical-align: middle;
    padding: 2px !important;
    width: 3.5% !important;
  }

  .sqr-table td:nth-child(1) .btn,
  .sqr-table td:nth-child(2) .btn,
  .sqr-table td:nth-child(3) .btn,
  .sqr-table th:nth-child(1) .btn,
  .sqr-table th:nth-child(2) .btn {
    height: 24px;
  }
  .sqr-table th:nth-child(3),
  .sqr-table td:nth-child(3) {
    width: 30%;
  }
  .sqr-table th,
  .sqr-table td {
    width: calc(60% / 8);
  }

  .sqr-table th:nth-child(3),
  .sqr-table td:nth-child(3) {
    width: 30%;
  }
  .sqr-table th,
  .sqr-table td {
    width: calc(60% / 8);
  }

  .panel th:first-child,
  .panel td:first-child{
    width: 37%;
  }
  .panel td:nth-child(2),
  .panel td,
  .panel th:nth-child(2),
  .panel th{
    width: 7.5%;
  }

  .panel.fixed {
    position: fixed;
    background: #fff;
    width: 100%;
    max-width: 1250px;
    top: 0;
    left: auto;
  }

  .pers {
    font-weight: bold;
    display: block;
  }

  @media (max-width: 1280px) {
    .table th{
      font-size: 16px;
    }
  }


  .filter-chanel img{
    height: 27px;
    width: auto;
  }

  .filter-chanel-big img{
    height: 37px;
    width: auto;
  }

  .table.panel .filter-chanel {
    width: auto;
    border-radius: 50%;
    border: none;
    background-color: #fff;
  }

  .filter-chanel.btn-disable-chanel img  {
    filter: grayscale(100%);
    filter: gray;
  }

  .red-font {
    color: red;
  }

  .green-font {
    color: #02a000;
  }

  .index-filter {
    height: 30px !important;
    padding: 6px 8px;
    margin-bottom: 4px !important;
    cursor: pointer;
  }

  .ghost-cell {
    position: absolute;
    top: 7px;
    left: 13px;
    z-index: 1;
  }

  .ghost-cell-parent:hover .ghost-cell {
    display: none;
  }

  input.form-control{
    height: 30px;
    width: calc(100%);
    display: inline-block;
    position: relative;
    top: 1.5px;
  }

  .width-6 {
    width: 6%;
  }

  .width-8 {
    width: 8% !important;
  }

  .m-2 {
    margin: 0rem!important;
  }

  .check {
    font-size: 24px;
    color: green;
  }

  .green-row {
    background: #4cb62596;
  }

  .red-row {
    background: #ff0f0869
  }

  .filters select {
    width: 40px !important;
    padding: 0 5px !important;
    height: 30px!important;
  }

  .filters input.form-control {
    width: calc(100% - 45px) !important;
  }

  .sqr-table-aligned td, .sqr-table-aligned th {
    width: 7.5%;
    text-align: right;
  }

  .sqr-table-aligned .text-align-left {
    text-align: left;
  }

  .panel th.column-with-btn, .panel td.column-with-btn {
    width: 50% !important;
  }

  .undo-btn {
    width: 40px !important;
    padding: 1px 0 !important;
  }

  table {
    margin-bottom: 10px !important;
  }

  .filters th {
    vertical-align: middle;
  }

  .yellow-bg {
    background: #fff84f;
  }

  .pers {
    font-size: 12px;
    max-width: none;
  }
</style>
