<script setup lang="ts">
import StoreFooter from '@/components/layout/StoreFooter.vue';
import StoreHeader from '@/components/layout/StoreHeader.vue';

</script>

<template>
    <StoreHeader/>
    <main>
        <RouterView/>
    </main>    
    <StoreFooter/>
</template>