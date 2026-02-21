<script>
	import { createEventDispatcher } from 'svelte';
	import Hero1 from './components/heroes/Hero1.svelte';
	import Hero2 from './components/heroes/Hero2.svelte';
	import Hero3 from './components/heroes/Hero3.svelte';
	import Hero4 from './components/heroes/Hero4.svelte';
	import About1 from './components/about/About1.svelte';
	import About2 from './components/about/About2.svelte';
	import About3 from './components/about/About3.svelte';
	import Services1 from './components/services/Services1.svelte';
	import Services2 from './components/services/Services2.svelte';
	import Locations1 from './components/locations/Locations1.svelte';
	import Contact1 from './components/contact/Contact1.svelte';
	import Contact2 from './components/contact/Contact2.svelte';
	import Faq1 from './components/faq/Faq1.svelte';
	import Gallery1 from './components/gallery/Gallery1.svelte';
	import Gallery2 from './components/gallery/Gallery2.svelte';
	import Header1 from './components/navigation/Nav1.svelte';
	import Header2 from './components/navigation/Nav2.svelte';
	import Header3 from './components/navigation/Nav3.svelte';
	import Header4 from './components/navigation/Nav4.svelte';
	import Footer1 from './components/footers/Footer1.svelte';
	import Footer2 from './components/footers/Footer2.svelte';
	import Cta1 from './components/cta/Cta1.svelte';

	export let website;
	export let pages = [];
	export let currentPage;
	export let sections = [];
	export let pb;
	export let embed = false;
	export let editor = false;
	export let selectedSectionId = null;
	export let selectedEditableElement = null;

	const emptyHeaderData = {};
	const emptyFooterData = {};

	const dispatch = createEventDispatcher();
	let hoveredSectionId = null;

	const componentMap = {
		header: { Header1, Header2, Header3, Header4 },
		hero: { Hero1, Hero2, Hero3, Hero4 },
		about: { About1, About2, About3 },
		services: { Services1, Services2 },
		locations: { Locations1 },
		contact: { Contact1, Contact2 },
		faq: { Faq1 },
		gallery: { Gallery1, Gallery2 },
		footer: { Footer1, Footer2 },
		cta: { Cta1 }
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

	const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

	function normalizeHexColor(value) {
		const raw = (value || '').toString().trim();
		if (!raw) return '';
		return HEX_COLOR_PATTERN.test(raw) ? raw.toLowerCase() : '';
	}

	function getSectionStyleConfig(section) {
		const style = section?.data?.component_style;
		if (!style || typeof style !== 'object' || Array.isArray(style)) return null;

		const backgroundColor = normalizeHexColor(style.backgroundColor);
		const textColor = normalizeHexColor(style.textColor);
		if (!backgroundColor && !textColor) return null;

		return { backgroundColor, textColor };
	}

	function getSectionInlineStyle(section) {
		const style = getSectionStyleConfig(section);
		if (!style) return '';

		const vars = [];
		if (style.backgroundColor) vars.push(`--tb-section-bg:${style.backgroundColor}`);
		if (style.textColor) vars.push(`--tb-section-text:${style.textColor}`);
		return vars.join(';');
	}

	function hasSectionBackgroundColor(section) {
		return Boolean(getSectionStyleConfig(section)?.backgroundColor);
	}

	function hasSectionTextColor(section) {
		return Boolean(getSectionStyleConfig(section)?.textColor);
	}

	const EDITABLE_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,li,a,button,img';

	function getDomPath(el, root) {
		const path = [];
		let current = el;
		while (current && current !== root) {
			const parent = current.parentElement;
			if (!parent) break;
			const index = Array.prototype.indexOf.call(parent.children, current);
			path.unshift(index);
			current = parent;
		}
		return path.join('-');
	}

	function getEditableId(el, root) {
		return `${el.tagName.toLowerCase()}-${getDomPath(el, root)}`;
	}

	function isButtonLike(el) {
		if (!el) return false;
		const tag = (el.tagName || '').toLowerCase();
		if (tag === 'button') return true;
		const role = (el.getAttribute('role') || '').toLowerCase();
		if (role === 'button') return true;
		const className = (el.className || '').toString().toLowerCase();
		return className.includes('btn') || className.includes('button') || className.includes('cta');
	}

	function getEditableKind(el) {
		const tag = (el?.tagName || '').toLowerCase();
		if (tag === 'img') return 'image';
		if (isButtonLike(el)) return 'button';
		return 'text';
	}

	function getEditableLabel(el, kind) {
		if (!el) return kind === 'image' ? 'Image' : kind === 'button' ? 'Button' : 'Text';
		if (kind === 'image') {
			const alt = (el.getAttribute('alt') || '').trim();
			return alt || 'Image';
		}
		const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
		if (text) return text.length > 60 ? `${text.slice(0, 57)}...` : text;
		return kind === 'button' ? 'Button' : 'Text';
	}

	function getElementStylesMap(section) {
		const raw = section?.data?.element_styles;
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

		const map = {};
		for (const [id, config] of Object.entries(raw)) {
			if (!config || typeof config !== 'object' || Array.isArray(config)) continue;
			const textColor = normalizeHexColor(config.textColor);
			const backgroundColor = normalizeHexColor(config.backgroundColor);
			if (!textColor && !backgroundColor) continue;
			map[id] = { textColor, backgroundColor };
		}
		return map;
	}

	function clearEditableDecoration(el) {
		if (!el) return;
		el.removeAttribute('data-tb-editable');
		el.removeAttribute('data-tb-edit-id');
		el.removeAttribute('data-tb-edit-kind');
		el.removeAttribute('data-tb-edit-label');
		el.removeAttribute('data-tb-edit-selected');
		el.style.removeProperty('--tb-edit-text');
		el.style.removeProperty('--tb-edit-bg');
		el.classList.remove('tb-edit-custom-text');
		el.classList.remove('tb-edit-custom-bg');
	}

	function decorateEditableElements(node, section, selected) {
		if (!node || !section) return;
		const contentRoot = node.querySelector('.tb-section-content');
		if (!contentRoot) return;

		const styleMap = getElementStylesMap(section);
		const selectedEditId = selected?.sectionId === section.id ? (selected?.editId || '') : '';
		const candidates = Array.from(contentRoot.querySelectorAll(EDITABLE_SELECTOR));
		const kept = new Set();

		for (const el of candidates) {
			const editId = getEditableId(el, contentRoot);
			const kind = getEditableKind(el);
			const label = getEditableLabel(el, kind);
			kept.add(el);

			el.setAttribute('data-tb-editable', '1');
			el.setAttribute('data-tb-edit-id', editId);
			el.setAttribute('data-tb-edit-kind', kind);
			el.setAttribute('data-tb-edit-label', label);

			if (selectedEditId && selectedEditId === editId) {
				el.setAttribute('data-tb-edit-selected', '1');
			} else {
				el.removeAttribute('data-tb-edit-selected');
			}

			const style = styleMap[editId] || {};
			if (style.textColor) {
				el.style.setProperty('--tb-edit-text', style.textColor);
				el.classList.add('tb-edit-custom-text');
			} else {
				el.style.removeProperty('--tb-edit-text');
				el.classList.remove('tb-edit-custom-text');
			}

			if (style.backgroundColor) {
				el.style.setProperty('--tb-edit-bg', style.backgroundColor);
				el.classList.add('tb-edit-custom-bg');
			} else {
				el.style.removeProperty('--tb-edit-bg');
				el.classList.remove('tb-edit-custom-bg');
			}
		}

		const previous = Array.from(contentRoot.querySelectorAll('[data-tb-editable="1"]'));
		for (const el of previous) {
			if (!kept.has(el)) clearEditableDecoration(el);
		}
	}

	function editableSectionAction(node, payload) {
		decorateEditableElements(node, payload?.section, payload?.selected);
		return {
			update(nextPayload) {
				decorateEditableElements(node, nextPayload?.section, nextPayload?.selected);
			},
			destroy() {
				const tagged = Array.from(node.querySelectorAll('[data-tb-editable="1"]'));
				for (const el of tagged) clearEditableDecoration(el);
			}
		};
	}

	$: hasHeaderSection = sections?.some((s) => s.section_type === 'header');
	$: hasFooterSection = sections?.some((s) => s.section_type === 'footer');

	function handleSectionClick(event, section) {
		if (!editor || !section?.id) return;
		const host = event?.currentTarget;
		const target = event?.target;
		const editable = target?.closest?.('[data-tb-editable="1"]');
		event?.preventDefault?.();
		event?.stopPropagation?.();
		dispatch('sectionSelect', { sectionId: section.id });
		if (editable && host?.contains(editable)) {
			dispatch('elementSelect', {
				sectionId: section.id,
				editId: editable.getAttribute('data-tb-edit-id') || '',
				kind: editable.getAttribute('data-tb-edit-kind') || 'text',
				label: editable.getAttribute('data-tb-edit-label') || ''
			});
		}
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
				class:tb-custom-bg={hasSectionBackgroundColor(section)}
				class:tb-custom-text={hasSectionTextColor(section)}
				style={getSectionInlineStyle(section)}
				use:editableSectionAction={{ section, selected: selectedEditableElement }}
				on:mouseenter={() => handleSectionMouseEnter(section)}
				on:mouseleave={() => handleSectionMouseLeave(section)}
				on:click={(e) => handleSectionClick(e, section)}
			>
				{#if editor && (hoveredSectionId === section.id || selectedSectionId === section.id)}
					<div class="tb-builder-badge">
						{section.section_type}{#if section.variant} · {section.variant}{/if}
					</div>
				{/if}
				<div class="tb-section-content">
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
	.tb-embed :global(.tb-header-2),
	.tb-embed :global(.tb-header-4) {
		position: sticky !important;
		top: 0;
		left: auto !important;
		right: auto !important;
	}

	.tb-embed :global(.tb-nav-spacer),
	.tb-embed :global(.tb-header-2-spacer),
	.tb-embed :global(.tb-header-4-spacer) {
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

	.tb-builder-section :global([data-tb-editable='1']) {
		outline: 1px solid transparent;
		outline-offset: 2px;
		transition: outline-color 0.12s ease, box-shadow 0.12s ease;
		cursor: pointer;
	}

	.tb-builder-section :global([data-tb-editable='1']:hover) {
		outline-color: rgba(14, 165, 233, 0.95);
		box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.25);
	}

	.tb-builder-section :global([data-tb-editable='1'][data-tb-edit-selected='1']) {
		outline: 2px solid rgba(14, 165, 233, 1);
		box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.35);
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

	.tb-custom-bg > .tb-section-content > :global(*) {
		background: var(--tb-section-bg) !important;
	}

	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-2),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-2 > div),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-3),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-3 .tb-header3-top),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-3 .tb-header3-main),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-3 .tb-header3-mobile),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-4),
	.tb-custom-bg[data-builder-section-type='header'] :global(.tb-header-4 > div) {
		background: var(--tb-section-bg) !important;
	}

	.tb-custom-text {
		color: var(--tb-section-text);
	}

	.tb-custom-text :global(h1),
	.tb-custom-text :global(h2),
	.tb-custom-text :global(h3),
	.tb-custom-text :global(h4),
	.tb-custom-text :global(h5),
	.tb-custom-text :global(h6),
	.tb-custom-text :global(p),
	.tb-custom-text :global(span),
	.tb-custom-text :global(li),
	.tb-custom-text :global(a),
	.tb-custom-text :global(label),
	.tb-custom-text :global(strong),
	.tb-custom-text :global(em),
	.tb-custom-text :global(small) {
		color: var(--tb-section-text) !important;
	}

	:global(.tb-edit-custom-text) {
		color: var(--tb-edit-text) !important;
	}

	:global(.tb-edit-custom-bg) {
		background-color: var(--tb-edit-bg) !important;
	}
</style>
