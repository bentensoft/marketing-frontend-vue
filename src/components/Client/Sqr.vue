<template>
  <b-row class='sqr-ngram'>
    <b-col cols='12'>
      <div style="margin-bottom: 3%">
        <h2 class="ngram-h">Summary Table</h2>
        <SqrTotals></SqrTotals>
      </div>
      <div class="ngram">
        <h2 class="ngram-h">Ngram Analysis</h2>
        <Ngram v-model="searchFromNgram" :timeframe="timeframe" ></Ngram>
      </div>
      <h2  class="sqr-h">Search Query Analysis</h2>
      <Sqr v-model="timeframe" :searchFromNgram="searchFromNgram"></Sqr>
    </b-col>
  </b-row>
</template>

<script>
import Sqr from './Components/SqrPpr.vue'
import Ngram from './Components/Ngram.vue'
import SqrTotals from './Components/SqrTotals'
export default {
  name: 'sqr-page',
  data () {
    return {
      timeframe: 'all_time',
      searchFromNgram: ''
    }
  },
  components: {
    Sqr,
    Ngram,
    SqrTotals
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .table th, .table tr {
    padding: 2px 4px;
  }


.sqr-ngram {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
