<script setup>
import Post from '@/components/Post.vue';
import CreatePost from '@/components/CreatePost.vue';


</script>

<template>
  <main class="d-flex justify-center">
    <div class="w-50 mt-5">
      <CreatePost />
      <Post
        author-name="Laura Martínez"
        author-subtitle="UX Researcher"
        avatar="https://i.pravatar.cc/80?img=10"
        timestamp="Hace 2 horas"
        content="Hoy probamos la nueva funcionalidad de analytics..."
        media="https://imgs.search.brave.com/DKeqy0xYqA9SiLztU8QCNvkdXRduEQWUwMAs9WFB4VY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/MTg3MTQ0L2VzL2Zv/dG8vcGF0by1pbnF1/aXNpdGl2ZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9MjIw/UGF5Vl9Wd3dhcnZn/ZWdSanZLV2xPUkE5/THk1czNMTC1QdWot/cVk4cz0"
        :likes="128"
        :comments="34"
        :shares="12"
        class="mt-10"
      />
    </div>
    
  </main>
</template>
