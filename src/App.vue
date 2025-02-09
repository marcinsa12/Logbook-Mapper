<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <div class="wrapper">
        <div class="header-content">
          <Header msg="Your Logbook Mapper" />
          <nav>
            <RouterLink to="/">Stats</RouterLink>
            <RouterLink to="/Map">Map</RouterLink>
            <RouterLink to="/Logbook">Logbook</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  flex: 0 0 auto;
  line-height: 1.5;
  padding: 1rem 0;
}

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}

nav {
  width: auto;
  font-size: 12px;
  text-align: right;
  white-space: nowrap;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header .wrapper {
    display: flex;
    place-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  nav {
    text-align: right;
    margin: 0;
    font-size: 1rem;
    padding: 1rem 0;
  }
}

/* For very wide screens */
@media (min-width: 1441px) {
  .main-content {
    padding: 2rem;
  }
}

/* For mobile devices */
@media (max-width: 600px) {
  .main-content {
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  nav {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
