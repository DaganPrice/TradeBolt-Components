<script>
	import Hero1 from './components/heroes/Hero1.svelte';
	import Hero2 from './components/heroes/Hero2.svelte';
	import About1 from './components/about/About1.svelte';
	import Services1 from './components/services/Services1.svelte';
	import Locations1 from './components/locations/Locations1.svelte';
	import Contact1 from './components/contact/Contact1.svelte';
	import Contact2 from './components/contact/Contact2.svelte';
	import Gallery1 from './components/gallery/Gallery1.svelte';
	import Header1 from './components/navigation/Nav1.svelte';
	import Header2 from './components/navigation/Nav2.svelte';
	import Footer1 from './components/footers/Footer1.svelte';

	export let website;
	export let pages = [];
	export let currentPage;
	export let sections = [];
	export let pb;
	export let embed = false;

	const emptyHeaderData = {};
	const emptyFooterData = {};

	const componentMap = {
		header: { Header1, Header2 },
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

	$: hasHeaderSection = sections?.some((s) => s.section_type === 'header');
	$: hasFooterSection = sections?.some((s) => s.section_type === 'footer');
</script>

<div class="tb-cq min-h-screen bg-white" class:tb-embed={embed}>
	{#if !hasHeaderSection}
		<Header1 {website} {pb} {pages} {currentPage} {sections} data={emptyHeaderData} />
	{/if}

	{#each sections as section (section.id)}
		{@const Component = getComponent(section)}
		{#if Component}
			<div id={section.section_type}>
				<svelte:component
					this={Component}
					{website}
					data={section.data}
					{pb}
					{sections}
					{pages}
					{currentPage}
				/>
			</div>
		{/if}
	{/each}

	{#if !hasFooterSection}
		<div id="footer">
			<Footer1 {website} {pb} data={emptyFooterData} {sections} {pages} {currentPage} />
		</div>
	{/if}
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
