<script>
	export let website;
	export let pb;
	export let pages = []; // Array of pages for multi-page navigation
	export let currentPage = null; // Current page being viewed
	export let sections = []; // Sections on the current page (for jump links)
	export let data = {}; // Optional header section data

	let logoUrl = null;
	let mobileMenuOpen = false;

	if (website.logo) {
		logoUrl = pb.files.getURL(website, website.logo);
	}

	function getOrderedNavPages(allPages, orderKeys) {
		const visible = (allPages || []).filter((p) => p?.is_visible && !p?.is_home);
		const order = Array.isArray(orderKeys) ? orderKeys : [];
		if (order.length === 0) return visible;

		const byId = new Map(visible.map((p) => [p.id, p]));
		const bySlug = new Map(visible.map((p) => [p.slug, p]));

		const ordered = order
			.map((key) => byId.get(key) || bySlug.get(key))
			.filter(Boolean);
		const orderedIds = new Set(ordered.map((p) => p.id));
		const remaining = visible.filter((p) => !orderedIds.has(p.id));
		return [...ordered, ...remaining];
	}

	// Get visible pages for navigation (excluding home, which goes in logo)
	$: navPages = getOrderedNavPages(pages, data?.page_nav_order);

	// Determine if this is a multi-page site (more than just the home page)
	$: isMultiPage = navPages.length > 0;

	// Get unique section types on the current page for jump links
	$: allSectionTypes = [...new Set(sections.filter((s) => s.is_visible).map((s) => s.section_type))];

	// Apply custom order if specified in header data, otherwise use default order
	$: sectionTypes = (() => {
		const navOrder = data?.nav_order;
		if (navOrder && Array.isArray(navOrder) && navOrder.length > 0) {
			// Use custom order, but only include sections that actually exist
			return navOrder.filter((type) => allSectionTypes.includes(type));
		}
		// Default order: all visible sections
		return allSectionTypes;
	})();

	// Map section types to readable labels
	function getSectionLabel(sectionType) {
		const labels = {
			about: 'About',
			services: 'Services',
			locations: 'Locations',
			contact: 'Contact',
			gallery: 'Gallery'
		};
		return labels[sectionType] || sectionType.charAt(0).toUpperCase() + sectionType.slice(1);
	}

	$: contactCtaLabel =
		data && typeof data.contact_cta_label === 'string' && data.contact_cta_label.trim()
			? data.contact_cta_label.trim()
			: getSectionLabel('contact');

	$: showCtaButton = data?.show_cta_button !== false;
	$: ctaLabel =
		data && typeof data.cta_label === 'string' && data.cta_label.trim()
			? data.cta_label.trim()
			: 'Get a Quote';

	$: contactPage =
		pages.find((p) => p.is_visible && p.slug === 'contact') ||
		pages.find((p) => p.is_visible && (p.title || '').toLowerCase().includes('contact')) ||
		null;

	$: ctaHref = isMultiPage ? (contactPage ? `/${contactPage.slug}` : '/contact') : '#contact';

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function scrollToSection(sectionId) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			mobileMenuOpen = false;
		}
	}

	function handleNavClick(event, page) {
		// For multi-page sites, let the browser handle the navigation
		// For single-page sites, use smooth scroll
		if (!isMultiPage) {
			event.preventDefault();
			scrollToSection(page.slug.replace('-', ''));
		}
		mobileMenuOpen = false;
	}

	function handleCtaClick(event) {
		if (!showCtaButton) return;

		const isOnContactPage = !!(contactPage && currentPage && contactPage.id === currentPage.id);
		if (!isMultiPage || isOnContactPage) {
			event.preventDefault();
			scrollToSection('contact');
		}

		mobileMenuOpen = false;
	}

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				text: 'text-orange-600',
				hover: 'hover:text-orange-600',
				bg: 'bg-orange-600',
				hoverBg: 'hover:bg-orange-700'
			},
			red: {
				text: 'text-red-600',
				hover: 'hover:text-red-600',
				bg: 'bg-red-600',
				hoverBg: 'hover:bg-red-700'
			},
			blue: {
				text: 'text-blue-600',
				hover: 'hover:text-blue-600',
				bg: 'bg-blue-600',
				hoverBg: 'hover:bg-blue-700'
			},
			green: {
				text: 'text-green-600',
				hover: 'hover:text-green-600',
				bg: 'bg-green-600',
				hoverBg: 'hover:bg-green-700'
			},
			yellow: {
				text: 'text-yellow-600',
				hover: 'hover:text-yellow-600',
				bg: 'bg-yellow-600',
				hoverBg: 'hover:bg-yellow-700'
			},
			purple: {
				text: 'text-purple-600',
				hover: 'hover:text-purple-600',
				bg: 'bg-purple-600',
				hoverBg: 'hover:bg-purple-700'
			},
			pink: {
				text: 'text-pink-600',
				hover: 'hover:text-pink-600',
				bg: 'bg-pink-600',
				hoverBg: 'hover:bg-pink-700'
			},
			gray: {
				text: 'text-gray-600',
				hover: 'hover:text-gray-600',
				bg: 'bg-gray-600',
				hoverBg: 'hover:bg-gray-700'
			}
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
</script>

<nav class="fixed top-0 right-0 left-0 z-50 bg-white shadow-md">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo / Business Name -->
			<a
				href={isMultiPage ? '/' : '#hero'}
				on:click={isMultiPage
					? null
					: (e) => {
							e.preventDefault();
							scrollToSection('hero');
						}}
				class="flex flex-shrink-0 items-center space-x-3"
			>
				{#if logoUrl}
					<img src={logoUrl} alt="{website.business_name} logo" class="h-10 w-auto" />
				{:else}
					<span class="text-xl font-bold text-gray-900">{website.business_name}</span>
				{/if}
			</a>

			<div class="flex items-center gap-8">
				<!-- Desktop Navigation -->
				<div class="tb-nav-desktop items-center gap-8">
					{#if isMultiPage}
						<!-- Multi-page navigation: Link to actual pages -->
						{#each navPages as page}
							<a
								href="/{page.slug}"
								class="text-gray-700 {colors.hover} font-medium transition-colors {currentPage &&
								currentPage.id === page.id
									? 'font-bold ' + colors.text
									: ''}"
							>
								{page.title}
							</a>
						{/each}
					{:else}
						<!-- Single-page navigation: Jump links within page -->
						{#each sectionTypes as sectionType}
							{#if sectionType !== 'header' && sectionType !== 'hero' && sectionType !== 'footer'}
								{#if sectionType === 'contact' && !showCtaButton}
									<a
										href="#{sectionType}"
										on:click|preventDefault={() => scrollToSection(sectionType)}
										class="px-6 py-2 {colors.bg} {colors.hoverBg} rounded-lg font-semibold text-white transition-colors"
									>
										{contactCtaLabel}
									</a>
								{:else}
									<a
										href="#{sectionType}"
										on:click|preventDefault={() => scrollToSection(sectionType)}
										class="text-gray-700 {colors.hover} font-medium transition-colors"
									>
										{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
									</a>
								{/if}
							{/if}
						{/each}
					{/if}
				</div>

				{#if showCtaButton}
					<a
						href={ctaHref}
						on:click={handleCtaClick}
						class="tb-nav-cta px-5 py-2 {colors.bg} {colors.hoverBg} rounded-lg font-semibold text-white transition-colors"
					>
						{ctaLabel}
					</a>
				{/if}

				<!-- Mobile Menu Button -->
				<button
					on:click={toggleMobileMenu}
					class="tb-nav-mobile rounded-lg p-2 transition-colors hover:bg-gray-100"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<svg
							class="h-6 w-6 text-gray-900"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg
							class="h-6 w-6 text-gray-900"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="tb-nav-mobile-menu border-t border-gray-200 py-4">
				<div class="flex flex-col space-y-4">
					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class="px-6 py-2 {colors.bg} {colors.hoverBg} rounded-lg text-center font-semibold text-white transition-colors"
						>
							{ctaLabel}
						</a>
					{/if}

					{#if isMultiPage}
						<!-- Multi-page mobile navigation -->
						{#each navPages as page}
							<a
								href="/{page.slug}"
								on:click={() => (mobileMenuOpen = false)}
								class="text-gray-700 {colors.hover} px-2 font-medium transition-colors {currentPage &&
								currentPage.id === page.id
									? 'font-bold ' + colors.text
									: ''}"
							>
								{page.title}
							</a>
						{/each}
					{:else}
						<!-- Single-page mobile navigation: Jump links -->
						{#each sectionTypes as sectionType}
							{#if sectionType !== 'header' && sectionType !== 'hero' && sectionType !== 'footer'}
								{#if sectionType === 'contact' && !showCtaButton}
									<a
										href="#{sectionType}"
										on:click|preventDefault={() => scrollToSection(sectionType)}
										class="px-6 py-2 {colors.bg} {colors.hoverBg} rounded-lg text-center font-semibold text-white transition-colors"
									>
										{contactCtaLabel}
									</a>
								{:else}
									<a
										href="#{sectionType}"
										on:click|preventDefault={() => scrollToSection(sectionType)}
										class="text-gray-700 {colors.hover} px-2 font-medium transition-colors"
									>
										{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
									</a>
								{/if}
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>

<!-- Spacer to prevent content from going under fixed nav -->
<div class="tb-nav-spacer h-16"></div>

<style>
	/* Default to mobile layout; switch to desktop based on renderer container width. */
	.tb-nav-desktop {
		display: none;
	}

	.tb-nav-mobile {
		display: inline-flex;
	}

	.tb-nav-cta {
		display: none;
		padding: 0.5rem 1.25rem;
		align-items: center;
		justify-content: center;
	}

	@container (min-width: 768px) {
		.tb-nav-desktop {
			display: flex;
		}

		.tb-nav-mobile {
			display: none;
		}

		.tb-nav-mobile-menu {
			display: none;
		}

		.tb-nav-cta {
			display: inline-flex;
		}
	}
</style>
