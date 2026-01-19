<script>
	import { createEventDispatcher } from 'svelte';
	import Hero1 from './components/heroes/Hero1.svelte';
	import Hero2 from './components/heroes/Hero2.svelte';
	import Hero3 from './components/heroes/Hero3.svelte';
	import About1 from './components/about/About1.svelte';
	import About2 from './components/about/About2.svelte';
	import Services1 from './components/services/Services1.svelte';
	import Locations1 from './components/locations/Locations1.svelte';
	import Contact1 from './components/contact/Contact1.svelte';
	import Contact2 from './components/contact/Contact2.svelte';
	import Gallery1 from './components/gallery/Gallery1.svelte';
	import Header1 from './components/navigation/Nav1.svelte';
	import Header2 from './components/navigation/Nav2.svelte';
	import Header3 from './components/navigation/Nav3.svelte';
	import Footer1 from './components/footers/Footer1.svelte';

	export let website;
	export let pages = [];
	export let currentPage;
	export let sections = [];
	export let pb;
	export let embed = false;
	export let editor = false;
	export let selectedSectionId = null;

	const emptyHeaderData = {};
	const emptyFooterData = {};

	const dispatch = createEventDispatcher();
	let hoveredSectionId = null;

	const componentMap = {
		header: { Header1, Header2, Header3 },
		hero: { Hero1, Hero2, Hero3 },
		about: { About1, About2 },
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

	function handleSectionClick(event, section) {
		if (!editor || !section?.id) return;
		event?.preventDefault?.();
		event?.stopPropagation?.();
		dispatch('sectionSelect', { sectionId: section.id });
	}

	function handleSectionMouseEnter(section) {
		if (!editor || !section?.id) return;
		hoveredSectionId = section.id;
	}

	function handleSectionMouseLeave(section) {
		if (!editor || !section?.id) return;
		if (hoveredSectionId === section.id) hoveredSectionId = null;
	}
</script>

<div class="tb-cq min-h-screen bg-white" class:tb-embed={embed}>
	{#if !hasHeaderSection}
		<Header1 {website} {pb} {pages} {currentPage} {sections} data={emptyHeaderData} {embed} />
	{/if}

	{#each sections as section (section.id)}
		{@const Component = getComponent(section)}
		{#if Component}
			<div
				id={section.section_type}
				data-builder-section-id={section.id}
				data-builder-section-type={section.section_type}
				class:tb-builder-section={editor}
				class:tb-builder-hover={editor && hoveredSectionId === section.id && selectedSectionId !== section.id}
				class:tb-builder-selected={editor && selectedSectionId === section.id}
				on:mouseenter={() => handleSectionMouseEnter(section)}
				on:mouseleave={() => handleSectionMouseLeave(section)}
				on:click={(e) => handleSectionClick(e, section)}
			>
				{#if editor && (hoveredSectionId === section.id || selectedSectionId === section.id)}
					<div class="tb-builder-badge">
						{section.section_type}{#if section.variant} · {section.variant}{/if}
					</div>
				{/if}
				<svelte:component
					this={Component}
					{website}
					data={section.data}
					{pb}
					{sections}
					{pages}
					{currentPage}
					{embed}
				/>
			</div>
		{/if}
	{/each}

	{#if !hasFooterSection}
		<div id="footer">
			<Footer1 {website} {pb} data={emptyFooterData} {sections} {pages} {currentPage} {embed} />
		</div>
	{/if}
</div>

<style>
	.tb-cq {
		container-type: inline-size;
	}

	.tb-embed :global(nav),
	.tb-embed :global(.tb-header-2) {
		position: sticky !important;
		top: 0;
		left: auto !important;
		right: auto !important;
	}

	.tb-embed :global(.tb-nav-spacer),
	.tb-embed :global(.tb-header-2-spacer) {
		display: none !important;
	}

	.tb-builder-section {
		position: relative;
		scroll-margin-top: 96px;
	}

	.tb-builder-hover {
		outline: 1px dashed rgba(255, 107, 0, 0.85);
		outline-offset: -1px;
	}

	.tb-builder-selected {
		outline: 2px solid rgba(255, 107, 0, 1);
		outline-offset: -2px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
	}

	.tb-builder-hover :global(nav),
	.tb-builder-selected :global(nav) {
		outline: inherit;
		outline-offset: inherit;
	}

	.tb-builder-badge {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 50;
		pointer-events: none;
		border-radius: 999px;
		background: rgba(17, 24, 39, 0.92);
		color: white;
		padding: 4px 10px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}
</style>
