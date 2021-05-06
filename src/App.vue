<template>
  <div id="app">
    
    <InputPage/>
  </div>
</template>

<script>
import Tests from './components/Tests'
import InputPage from './components/InputPage'

export default {
  name: 'App',
  components: {
    Tests,
    InputPage
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
