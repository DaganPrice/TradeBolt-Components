<script>
	import Nav1 from './Nav1.svelte';

	export let website;
	export let pb;
	export let pages = [];
	export let currentPage = null;
	export let sections = [];
</script>

<Nav1 {website} {pb} {pages} {currentPage} {sections} />
