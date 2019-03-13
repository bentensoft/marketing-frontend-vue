<template>
  <div class="ppr-wrap">
    <Ppr isPpr></Ppr>
  </div>
</template>

<script>
import Ppr from './Components/SqrPpr.vue'
export default {
  name: 'ppr',
  components: {
    Ppr
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload-btn{
  position: relative;
}

.ppr-wrap {
  max-width: 1280px;
  margin: 0 auto;
}

.upload-btn input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

input {
  width: 100%;
  height: 30px;
  max-width: 250px;
  display: inline-block;
}

span.length{
  background-color: #E9ECEF;
  border-radius: 10px;
  color: #333;
  display: inline-block;
  padding: 3px 5px;
}

.table th, .table td {
  padding: 5px;
}

.table td button,
.table th button {
  width: 100%;
  padding: 0;
}

.sqr-panel {
  margin-bottom: 0;
}

th{
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

.table{
  font-size: 14px;
}

.sqr-table,
.sqr-panel{
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

.sqr-table.add-exc th:nth-child(4),
.sqr-table.add-exc td:nth-child(4) {
  width: 25%;
}

.sqr-table th:nth-child(1),
.sqr-table td:nth-child(1),
.sqr-table th:nth-child(2),
.sqr-table td:nth-child(2) {
  width: 5%;
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

.sqr-panel th:first-child,
.sqr-panel td:first-child{
  width: 40%;
}
.sqr-panel td:nth-child(2),
.sqr-panel td,
.sqr-panel th:nth-child(2),
.sqr-panel th{
  width: 7.5%;
}
.sqr-panel td:last-child,
.sqr-panel th:last-child{
  width: 15%;
}

.sqr-panel.fixed {
  position: fixed;
  background: #fff;
  width: calc(100% - 70px);
  top: 0;
  left: 35px;
}
</style>
