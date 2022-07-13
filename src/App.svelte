<script lang="ts">
  import Router from 'svelte-spa-router';

  import TailwindCss from './TailwindCSS.svelte';
  import { routes } from './router';
  import Header from './components/Header.svelte';
</script>

<TailwindCss />
<Header />
<main class="pt-16">
  <div class="container mx-auto px-6 my-4">
    <Router {routes} />
  </div>
</main>
