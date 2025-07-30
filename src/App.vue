<template>
  <div class="app">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const msg = ref('hello world');
</script>