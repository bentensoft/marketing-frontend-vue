<template>
  <div class="ngram">
    <b-row class='mt-4 mb-4'>
      <b-col>
        <b-btn
         @click='tableType = "active"; updateNgram("active")'
         block
         :variant='tableType === "active" ? "primary" : "secondary"'>Ngram Data <span class="length">{{makeComa(activeCount)}}</span></b-btn>
      </b-col>
      <b-col>
        <b-btn
         @click='tableType = "added";'
         block
         :variant='tableType === "added" ? "primary" : "secondary"'>Added  <span class="length">{{makeComa(addedCount)}}</span></b-btn>
      </b-col>
      <b-col>
        <b-btn
         @click='tableType = "excluded"; updateNgram("excluded")'
         block
         :variant='tableType === "excluded" ? "primary" : "secondary"'>Excluded  <span class="length">{{makeComa(excludedCount)}}</span></b-btn>
      </b-col>
    </b-row>
    <table class='table ngram-panel mb-0 table-bordered'>
      <tr class='filters'>
        <th :class="isLoading ? 'yellow-bg' : ''" :colspan="firstCell">
          <transition v-if='isLoading' name='fade'>
            <p style="margin: 0" class="ml-1"><b>{{loadingText}}</b> <i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
          </transition>
          <b-form-input v-model.trim="search" @input='searchData()' type='text'
                        placeholder='Search'></b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.impressions.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.impressions.value"
           type="text">
          </b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.click.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.click.value"
           type="text">
          </b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.ctr.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.ctr.value"
           type="text">
          </b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.cost.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.cost.value"
           type="text">
          </b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.conversions.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.conversions.value"
           type="text">
          </b-form-input>
        </th>
        <th>
          <b-form-select
           @input='filterTable(tableType)'
           v-model='filterVal.cpa.comparison'
           :options='comparison'>
          </b-form-select>
          <b-form-input
           @input='validateFilterVal();filterTable(tableType)'
           v-model.trim="filterVal.cpa.value"
           type="text">
          </b-form-input>
        </th>
        <th :colspan="resetCell" class="reset-align">
          <button class="reset-btn" @click="resetFilters()">Reset</button>
        </th>
      </tr>
    <!--</table>-->
    <!--<table :class='tableType === "excluded" || tableType === "added" ? "ngram-table__big" : ""' class="table ngram-table table-bordered">-->
      <tr>
        <template v-if='tableType === "active"'>
          <th><b-button block @click='addExcludeActivate("all", "added")' variant='success'><i class="fa fa-plus" aria-hidden="true"></i> All</b-button></th>
          <th><b-button block @click='addExcludeActivate("all", "excluded")' variant='danger'><i class="fa fa-trash" aria-hidden="true"></i> All</b-button></th>
        </template>
        <template v-else>
          <th>Author</th>
          <th>Date</th>
          <th colspan="2">Activate</th>
        </template>
        <th :colspan="secondCell">
        </th>
        <th class="align-right" @click='sort === "impressions" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "impressions";  updateNgram(tableType)'>
          Impr.
          <i v-if='sort === "impressions"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "clicks" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "clicks";  updateNgram(tableType)'>
          Clicks
          <i v-if='sort === "clicks"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "ctr" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "ctr";  updateNgram(tableType)'>
          CTR
          <i v-if='sort === "ctr"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "cost" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "cost";  updateNgram(tableType)'>
          Cost
          <i v-if='sort === "cost"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "conversions" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "conversions";  updateNgram(tableType)'>
          Conv.
          <i v-if='sort === "conversions"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "cpa" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "cpa";  updateNgram(tableType)'>
          CPA
          <i v-if='sort === "cpa"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <th class="align-right" @click='sort === "index" ? sortDirectionDown = !sortDirectionDown : sortDirectionDown = false;sort = "index";  updateNgram(tableType)'>
          Index
          <i v-if='sort === "index"' :class='sortDirectionDown ? "rotate" : ""'><i class="fa fa-arrow-down" aria-hidden="true"></i></i>
        </th>
        <template v-if='tableType !== "active"'>
          <th>
            Actions
          </th>
        </template>
      </tr>
      <tr v-for='(ngram, index) in filterNgram' :key='index'>
        <template v-if='tableType === "active"'>
          <td class="text-center"><b-button @click='addExcludeActivate(ngram.id, "added", index)' block variant='success'><i class="fa fa-plus" aria-hidden="true"></i></b-button></td>
          <td class="text-center"><b-button @click='addExcludeActivate(ngram.id, "excluded", index)' block variant='danger'><i class="fa fa-trash" aria-hidden="true"></i></b-button></td>
        </template>
        <template v-else>
          <td class="text-center">
             <!--<img :src="ngram.author.avatar" alt="" class="avatar">-->
            <p>{{ngram.author ? ngram.author.username : ''}}</p>
          </td>
          <td class="date">
             {{ngram.modified ? (sqr.modified.slice(0, 10) + ' ' + sqr.modified.slice(11)): ''}}
          </td>
          <td colspan="2" class="text-center"><b-button @click='addExcludeActivate(ngram.id, "active", index)' block variant='primary'>Activate</b-button></td>
        </template>
        <td :colspan="secondCell"><button class="link-to-sqr" @click="searchInSqr(ngram.term)">{{ngram.term}}</button></td>
        <td class="align-right">{{ngram.impressions === 0 ? '-' : makeComa(ngram.impressions)}}</td>
        <td class="align-right">{{ngram.clicks ? makeComa(ngram.clicks) : '-'}}</td>
        <td class="align-right">{{ngram.ctr ? ngram.ctr + '%' : '-'}}</td>
        <td class="align-right">{{ngram.cost ? '$' + makeComa(ngram.cost) : '-'}}</td>
        <td class="align-right">{{ngram.conversions ? makeComa(ngram.conversions) : '-'}}</td>
        <td class="align-right">{{ngram.cpa ? '$' + makeComa(ngram.cpa) : '-'}}</td>
        <td class="align-right">{{ngram.index != '0' ? ngram.index : '-'}}</td>
        <template v-if='tableType !== "active"'>
          <td>
            <b-button>Undo</b-button>
          </td>
        </template>
      </tr>
    </table>
    <b-pagination v-if='filterNgram.length !== 0' align='right' size="sm" :total-rows=" this.activeCount"  v-model="currentPage" :per-page="10"></b-pagination>
  </div>
</template>

<script>
import Loader from '@/components/UI/Loader.vue'

export default {
  name: 'ngram',
  props: {
    timeframe: { type: String, default: 'all_time' },
    value: { type: String, default: '' }
  },
  model: {
    event: 'change'
  },
  data () {
    return {
      loadingText: 'Loading',
      activeTable: [],
      addedTable: [],
      numberPage: 1,
      currentPage: 1,
      excludedTable: [],
      filterNgram: [],
      isLoading: true,
      sort: 'impressions',
      tableType: 'active',
      lastTableType: '',
      addedCount: 0,
      excludedCount: 0,
      activeCount: 0,
      search: '',
      sortDirectionDown: false,
      comparison: [
        {value: '=', text: '='},
        {value: '>', text: '>'},
        {value: '<', text: '<'},
        {value: '<=', text: '≤'},
        {value: '>=', text: '≥'}
      ],
      filterVal: {
        impressions: {value: '', comparison: '>'},
        click: {value: '', comparison: '>'},
        ctr: {value: '', comparison: '>'},
        cost: {value: '', comparison: '>'},
        conversions: {value: '', comparison: '>'},
        cpa: {value: '', comparison: '>'},
        index: {value: '', comparison: '>'}
      }
    }
  },
  watch: {
    timeframe: function () {
      this.updateNgram()
    },
    currentPage: function (newPage) {
      this.numberPage = newPage
      this.updateNgram('active')
    }
  },
  components: {
    Loader
  },
  methods: {
    validateFilterVal () {
      for (var filter in this.filterVal) {
        var val = this.filterVal[filter].value
        if (+val < 0 || val === '' || val === '-') {
          this.filterVal[filter].value = ''
        }
      }
    },
    filterTable (tableType) {
      if (this.currentPage !== 1) {
        this.currentPage = 1
      } else {
        this.updateNgram(tableType)
      }
    },
    makeComa (val) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
        ctr: {value: '', comparison: '>'},
        cost: {value: '', comparison: '>'},
        conversions: {value: '', comparison: '>'},
        cpa: {value: '', comparison: '>'},
        index: {value: '', comparison: '>'}
      }
      this.search = ''
    },
    searchData (isEmpty) {
      let timer = null
      const onComplete = (s) => {
        if (s === this.search) {
          this.filterTable()
          timer = null
        }
      }
      if (timer) {
        clearTimeout(timer)
      }
      this.search = isEmpty ? '' : this.search
      if (this.prevSearch !== this.search) {
        let s = this.search
        timer = setTimeout(() => { onComplete(s) }, 500)
        this.prevSearch = this.search
      }
    },
    searchInSqr (term) {
      if (term.indexOf(' ') >= 0) {
        var seperatedTerms = term.split(' ')
        var finalResult = ''
        for (var index in seperatedTerms) {
          finalResult += '+' + seperatedTerms[index] + ' '
        }
        term = finalResult.substring(0, finalResult.length - 1)
      }
      this.searchFromNgram = term
      this.$emit('change', '')
      setTimeout(() => {
        this.$emit('change', this.searchFromNgram)
        const ngram = document.getElementsByClassName('ngram')[0].offsetHeight
        const sqrH = document.getElementsByClassName('sqr-h')[0].offsetHeight
        const sqrPanel = document.getElementsByClassName('panel')[0].offsetHeight
        const needScroll = ngram + sqrPanel + sqrH
        window.scroll({ top: needScroll, left: 0, behavior: 'smooth' })
      }, 0)
    },
    getAddedNgram () {
      this.tableType = 'added'
      this.showedTable = this.addedTable
      this.isLoading = true
      this.axios.get(
        this.newApiProperty + `/api/bucket/keywords`,
        {
          dummy: false,
          customer_id: this.$route.params.id
        },
        this.configWithCredentials
      ).then((response) => {
        this.fillTable(response)
        this.isLoading = false
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        console.log(error.response)
        this.isLoading = false
      })
    },
    addExcludeActivate (id, status, index) {
      if (index === undefined) {
        let wordArr = []
        this.activeTable.forEach((item) => {
          wordArr.push(item.word)
        })
      } else {
        if (status === 'active') {
          if (this.tableType === 'added') {
            this.activeTable.push(this.addedTable[index])
            this.addedTable.splice(index, 1)
            this.addedCount--
          } else if (this.tableType === 'excluded') {
            this.activeTable.push(this.excludedTable[index])
            this.excludedTable.splice(index, 1)
            this.excludedCount--
          }
          this.activeCount++
        } else if (status === 'added') {
          this.addedTable.push(this.activeTable[index])
          this.activeTable.splice(index, 1)
          this.addedCount++
          this.activeCount--
        } else if (status === 'excluded') {
          this.excludedTable.push(this.activeTable[index])
          this.activeTable.splice(index, 1)
          this.excludedCount++
          this.activeCount--
        }
      }
    },
    fillTable (response) {
      let formatTable = response.data.results
      formatTable.forEach((ngram) => {
        ngram.cpa = ngram.cpa === null ? 0 : +ngram.cpa.toFixed(2)
        ngram.ctr = ngram.ctr === null ? 0 : +ngram.ctr.toFixed(2)
        ngram.index = +ngram.index.toFixed(4)
        ngram.conversions = parseInt(+ngram.conversions)
        ngram.cost = parseInt(+ngram.cost)
        ngram.clicks = parseInt(+ngram.clicks)
        ngram.impressions = parseInt(+ngram.impressions)
      })
      this.activeCount = response.data.search_total.count
      this.filterNgram = formatTable
      this.isLoading = false
    },
    getFilters () {
      let impressionsFilter = this.filterVal.impressions.value !== '' ? 'impressions,' + (this.filterVal.impressions.comparison) + ',' + this.filterVal.impressions.value + ',' : ''
      let clickFilter = this.filterVal.click.value !== '' ? 'clicks,' + (this.filterVal.click.comparison) + ',' + this.filterVal.click.value + ',' : ''
      let ctrFilter = this.filterVal.ctr.value !== '' ? 'ctr,' + (this.filterVal.ctr.comparison) + ',' + this.filterVal.ctr.value + ',' : ''
      let costFilter = this.filterVal.cost.value !== '' ? 'cost,' + (this.filterVal.cost.comparison) + ',' + this.filterVal.cost.value + ',' : ''
      let conversionsFilter = this.filterVal.conversions.value !== '' ? 'conversions,' + (this.filterVal.conversions.comparison) + ',' + this.filterVal.conversions.value + ',' : ''
      let cpaFilter = this.filterVal.cpa.value !== '' ? 'cpa,' + (this.filterVal.cpa.comparison) + ',' + this.filterVal.cpa.value : ''

      return '&filter_by=' + impressionsFilter + clickFilter + ctrFilter + costFilter + conversionsFilter + cpaFilter
    },
    updateNgram (status) {
      let filters = this.getFilters()
      let sortDirection = !this.sortDirectionDown ? '-' : ''
      let page = '&page=' + this.numberPage

      this.isLoading = true
      const search = '&q=' + encodeURIComponent(this.search)
      const datarange = '&date_range=' + this.timeframe

//       check status
      if (status === 'active') {
        this.activeTable = []
      } else if (status === 'added') {
        this.addedTable = []
      } else if (status === 'excluded') {
        this.excludedTable = []
      }

      this.axios.get(
        this.newApiProperty + '/api/ngram?&customer_id=' + this.$route.params.id + '&dummy=false' + datarange + search + '&sort_by=' + sortDirection + this.sort + filters + page,
        this.configWithCredentials
      ).then((response) => {
        this.fillTable(response)
      }).catch((error) => {
        if (error.status === 401 || error.status === 403) {
          this.$router.push('/')
        }
        console.log(error.response)
        this.isLoading = false
      })
    }
  },
  created () {
    this.updateNgram('all')
  },
  computed: {
    firstCell () {
      return this.tableType === 'active' ? 7 : 9
    },
    secondCell () {
      return this.tableType === 'active' ? 5 : 5
    },
    resetCell () {
      return this.tableType === 'active' ? 1 : 2
    }
  }
}
</script>

<style scoped>

  select.form-control{
    height: 30px!important;
    padding-bottom: 0;
    padding-top: 0;
    width: auto;
    margin-top: 1px;
  }
  .reset-align {
    vertical-align: middle !important;
    text-align: center;
  }

  .reset-btn {
    margin: 2% 7%;
    padding: 0 20px 4px !important;
    background: #d9534f;
    color: white;
    border: none;
    border-radius: 3px;
  }
  input.form-control{
    height: 30px;
    width: calc(100% - 60px);
    display: inline-block;
    position: relative;
    top: 2.25px;
  }
span.length{
  background-color: #E9ECEF;
  border-radius: 10px;
  color: #333;
  display: inline-block;
  padding: 3px 5px;
}

.ngram-table tr th,
.ngram-table tr td:nth-child(3) {
  padding: 7px 3px 2px;
}

tr td .btn {
  font-size: 12px;
}

 i.rotate{
  display: inline-block;
  transform: rotate(180deg);
}

table i {
  font-size: 13px;
}

.table tr th{
  font-size: 16px;
  word-break: break-word;
  cursor: pointer;
}


span.edit {
  display: inline-block;
  cursor: pointer;
}

.align-right {
  text-align: right;
}

th {
  cursor: pointer;
  vertical-align: middle !important;
}

.table{
  table-layout: fixed;
}

.table tr:not(.filters)>td:nth-child(1),
.table tr:not(.filters)>td:nth-child(2),
.table tr:not(.filters)>th:nth-child(1),
.table tr:not(.filters)>th:nth-child(2){
  width: 4%;
  padding: 2px;
  vertical-align: middle;
}

.table tr:not(.filters)>td:nth-child(3),
.table tr:not(.filters)>th:nth-child(3) {
  width: 20%;
}

.ngram-panel tr th:first-child{
  width: 30%;
}
.ngram-panel tr th{
  width: 10.7%;
  padding-left: 5px !important;
}

.table tr:not(.filters)>td,
.table tr:not(.filters)>th {
  width: 10%;
}

.table th, .table td {
  padding: 4px 10px;
  font-size: 16px;
}

.table td button,
.table th button {
  padding: 0;
  height: 24px;
}

.ngram-panel tr:first-child th:not(:first-child) {
  padding-left: 0;
  padding-right: 0;
}

.ngram-table.ngram-table__big tr td:first-child,
.ngram-table.ngram-table__big tr th:first-child,
.ngram-table.ngram-table__big tr td:nth-child(2),
.ngram-table.ngram-table__big tr th:nth-child(2),
.ngram-table.ngram-table__big tr td:nth-child(3),
.ngram-table.ngram-table__big tr th:nth-child(3) {
  width: 5%;
}

.ngram-table__big tr td:nth-child(4),
.ngram-table__big tr th:nth-child(4) {
  width: 15%;
}

.link-to-sqr {
  background: none;
  border: none;
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}

.link-to-sqr:hover {
  color: #300a92;
}

  table {
    margin-bottom: 10px !important;
  }

  .yellow-bg {
    background: #fff84f;
  }
</style>
