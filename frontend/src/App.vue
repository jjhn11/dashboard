<script setup>
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import AppBar from '@/components/AppBar.vue';

const route = useRoute();

const isLoginView = computed(() => route.name === 'login' || route.name === 'register');
</script> 

<template>
  <v-app>
    <AppBar v-if="!isLoginView" />
    <v-main>
        <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
