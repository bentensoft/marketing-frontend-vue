<template class='sqr-filters'>
  <table class='table ngram-panel mb-0 table-bordered'>
    <tr class='filters'>
      <th colspan="3">
        <!--<b-form-input v-model.trim="search" @input='updateNgram()' type='text' placeholder='Search'></b-form-input>-->
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.impressions.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.impressions.value"
          type="text">
        </b-form-input>
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.click.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.click.value"
          type="text">
        </b-form-input>
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.ctr.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.ctr.value"
          type="text">
        </b-form-input>
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.cost.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.cost.value"
          type="text">
        </b-form-input>
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.conversions.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.conversions.value"
          type="text">
        </b-form-input>
      </th>
      <th>
        <b-form-select
          @input='updateNgram(tableType)'
          v-model='filterVal.cpa.comparison'
          :options='comparison'>
        </b-form-select>
        <b-form-input
          @input='validateFilterVal();updateNgram(tableType)'
          v-model.trim="filterVal.cpa.value"
          type="text">
        </b-form-input>
      </th>
      <th class="reset-align">
        <button class="reset-btn" @click="resetFilters()">Reset</button>
      </th>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'sqr-total',
  props: ['isShort'],
  data () {
    return {
      d:''
    }
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
