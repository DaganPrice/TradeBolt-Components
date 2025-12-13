<script>
	import Navigation from './components/navigation/Nav1.svelte';
	import Hero1 from './components/heroes/Hero1.svelte';
	import Hero2 from './components/heroes/Hero2.svelte';
	import About1 from './components/about/About1.svelte';
	import Services1 from './components/services/Services1.svelte';
	import Locations1 from './components/locations/Locations1.svelte';
	import Contact1 from './components/contact/Contact1.svelte';
	import Contact2 from './components/contact/Contact2.svelte';
	import Gallery1 from './components/gallery/Gallery1.svelte';
	import Footer1 from './components/footers/Footer1.svelte';

	export let website;
	export let pages = [];
	export let currentPage;
	export let sections = [];
	export let pb;
	export let embed = false;

	const componentMap = {
		hero: { Hero1, Hero2 },
		about: { About1 },
		services: { Services1 },
		locations: { Locations1 },
		contact: { Contact1, Contact2 },
		gallery: { Gallery1, Gallery2: Gallery1 },
		footer: { Footer1 }
	};

	function getComponent(section) {
		const typeComponents = componentMap[section.section_type];
		if (!typeComponents) {
			console.warn(`Unknown section type: ${section.section_type}`);
			return null;
		}

		const Component = typeComponents[section.variant];
		if (!Component) {
			console.warn(`Unknown variant ${section.variant} for section type ${section.section_type}`);
			return Object.values(typeComponents)[0];
		}

		return Component;
	}
</script>

<div class="min-h-screen bg-white tb-cq" class:tb-embed={embed}>
	<Navigation {website} {pages} {currentPage} {sections} {pb} />

	{#each sections as section (section.id)}
		{@const Component = getComponent(section)}
		{#if Component}
			<div id={section.section_type}>
				<svelte:component this={Component} {website} data={section.data} {pb} {sections} />
			</div>
		{/if}
	{/each}
</div>

<style>
	.tb-cq {
		container-type: inline-size;
	}

	.tb-embed :global(nav) {
		position: sticky;
		top: 0;
	}

	.tb-embed :global(.tb-nav-spacer) {
		display: none;
	}
</style>
