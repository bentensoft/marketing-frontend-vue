<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css';
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

p, a, a:hover, h1, h2, h3, h4, h5, h6, table.table, ul, li, button{
  font-family: "Circular Std", serif;
}

a, button, p, b:not(.pers), td, th, .progress-bar{
  font-size: 18px;
}

.btn {
  font-size: 20px;
}

.btn-danger, .btn-success {
  font-size: 16px;
}

a, a:hover, .btn{
	text-decoration: none;
}

.card-header-tabs {
  outline: none!important;
}

.notif{
  position: fixed;
  right: 10px;
  top: 10px;
  border-radius: 5px;
  border: 1px solid #fff;
  padding: 15px 20px;
}

.btn-white {
  background-color: #fff;
  color: #333;
  border: 1px solid #999;
  cursor: pointer;
}

.btn-white:hover {
  border: 1px solid #aaa;
  background-color: #eee;
}

.btn-grey {
  background-color: #99979c;
  color: #fff;
}

.btn-outline-grey {
  background-color: #fff;
  color: #333;
  border: 1px solid #99979c;
}

.btn-grey img, .btn-outline-grey img {
  border-radius: 50%;
}



.avatar{
  width: 34px;
  height: 34px;
  border: 1px solid #eee;
  border-radius: 50%;
}

/* Sidebar */
.main-view{
  margin: 20px 0;
}

.sidebar{
  z-index: 1000;
  position: fixed;
  left: 0;
  width: 0;
  height: 100%;
  margin-left: -200px;
  overflow-y: auto;
  background: #fcfcfc;
  transition: all 0.5s ease;
  border-right: 1px solid #cfcfcf;
}

.container-fluid {
  transition: all 0.5s ease;
}

.container-fluid.toggle {
  padding-left: 200px;
}

.container-fluid.toggle .sidebar {
  width: 200px;
  left: 200px;
}

.sidebar a{
  width: 180px;
  color: #999999;
  display: block;
  padding: 10px 20px;
  font-size: 20px;
}

.sidebar a:hover{
  color: deepskyblue;
}

.sidebar a.logo{
  margin-bottom: 40px;
}
.sidebar a.logo img {
  max-width: 100%;
  height: auto;
}

.sidebar a.signout{
  margin-top: 40px;
}
#main{
  padding: 0 20px 20px;
}

</style>
