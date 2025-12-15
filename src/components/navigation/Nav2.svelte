<script>
	import { onDestroy, onMount } from 'svelte';

	export let website;
	export let pb;
	export let pages = [];
	export let currentPage = null;
	export let sections = [];
	export let data = {};
	export let embed = false;

	let logoUrl = null;
	let logoSrcSet = '';
	let mobileMenuOpen = false;
	let openDropdown = null;
	let closeDropdownTimeout = null;
	let headerEl = null;
	let headerSpacerHeight = 140;
	let headerResizeObserver = null;

	function handleLinkClick(e) {
		if (embed) {
			e.preventDefault();
		}
	}

	function handleMobileLinkClick(e) {
		mobileMenuOpen = false;
		if (embed) {
			e.preventDefault();
		}
	}

	$: {
		if (website?.logo) {
			const src1x = pb.files.getURL(website, website.logo, { thumb: '256x256' });
			const src2x = pb.files.getURL(website, website.logo, { thumb: '512x512' });
			logoUrl = src1x;
			logoSrcSet = `${src1x} 1x, ${src2x} 2x`;
		} else {
			logoUrl = null;
			logoSrcSet = '';
		}
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

	// Get visible parent pages (no parent_id) for navigation
	$: allNavPages = getOrderedNavPages(pages, data?.page_nav_order);
	$: navPages = allNavPages.filter(p => !p.parent_id);

	// Group child pages by parent_id
	$: childrenByParentId = allNavPages.reduce((acc, page) => {
		if (page.parent_id) {
			if (!acc[page.parent_id]) acc[page.parent_id] = [];
			acc[page.parent_id].push(page);
		}
		return acc;
	}, {});

	function toggleDropdown(pageId) {
		// Clear any pending close timeout
		if (closeDropdownTimeout) {
			clearTimeout(closeDropdownTimeout);
			closeDropdownTimeout = null;
		}

		if (pageId === null) {
			// Delay closing to allow mouse to move to dropdown
			closeDropdownTimeout = setTimeout(() => {
				openDropdown = null;
			}, 150);
		} else {
			openDropdown = pageId;
		}
	}

	$: showCtaButton = data?.show_cta_button !== false;
	$: ctaLabel =
		data && typeof data.cta_label === 'string' && data.cta_label.trim()
			? data.cta_label.trim()
			: 'Get a Quote';

	$: contactPage =
		pages.find((p) => p.is_visible && p.slug === 'contact') ||
		pages.find((p) => p.is_visible && (p.title || '').toLowerCase().includes('contact')) ||
		null;

	$: ctaHref = contactPage ? `/${contactPage.slug}` : '/contact';

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleCtaClick() {
		mobileMenuOpen = false;
	}

	// Get color scheme classes
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { accent: 'bg-orange-500 text-white', accentHover: 'hover:bg-orange-600', textAccent: 'text-orange-500', hoverTextAccent: 'hover:text-orange-500' },
			red: { accent: 'bg-red-500 text-white', accentHover: 'hover:bg-red-600', textAccent: 'text-red-500', hoverTextAccent: 'hover:text-red-500' },
			blue: { accent: 'bg-blue-500 text-white', accentHover: 'hover:bg-blue-600', textAccent: 'text-blue-500', hoverTextAccent: 'hover:text-blue-500' },
			green: { accent: 'bg-green-500 text-white', accentHover: 'hover:bg-green-600', textAccent: 'text-green-500', hoverTextAccent: 'hover:text-green-500' },
			yellow: { accent: 'bg-yellow-500 text-white', accentHover: 'hover:bg-yellow-600', textAccent: 'text-yellow-500', hoverTextAccent: 'hover:text-yellow-500' },
			purple: { accent: 'bg-purple-500 text-white', accentHover: 'hover:bg-purple-600', textAccent: 'text-purple-500', hoverTextAccent: 'hover:text-purple-500' },
			pink: { accent: 'bg-pink-500 text-white', accentHover: 'hover:bg-pink-600', textAccent: 'text-pink-500', hoverTextAccent: 'hover:text-pink-500' },
			gray: { accent: 'bg-gray-500 text-white', accentHover: 'hover:bg-gray-600', textAccent: 'text-gray-500', hoverTextAccent: 'hover:text-gray-500' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
	$: phoneNumber = website?.contact_details?.phone || '';
	$: businessHours = data?.business_hours || 'Monday - Friday, 9am - 5pm';

	function updateHeaderSpacer() {
		if (!headerEl) return;
		const next = headerEl.offsetHeight || 0;
		if (next > 0) headerSpacerHeight = next;
	}

	onMount(() => {
		const win = typeof globalThis !== 'undefined' ? globalThis.window : undefined;

		updateHeaderSpacer();

		if (typeof ResizeObserver !== 'undefined') {
			headerResizeObserver = new ResizeObserver(() => updateHeaderSpacer());
			if (headerEl) headerResizeObserver.observe(headerEl);
		}

		win?.addEventListener?.('resize', updateHeaderSpacer);
	});

	onDestroy(() => {
		const win = typeof globalThis !== 'undefined' ? globalThis.window : undefined;
		win?.removeEventListener?.('resize', updateHeaderSpacer);
		headerResizeObserver?.disconnect?.();
	});
</script>

<header bind:this={headerEl} class="tb-header-2 fixed top-0 left-0 right-0 z-50 bg-zinc-900 text-white">
	<!-- Top Bar -->
	<div class="bg-zinc-950 border-b border-zinc-700">
		<div class="container mx-auto px-4 md:px-8">
			<div class="tb-top-bar-content py-3 gap-6">
				<!-- Logo Section -->
				<a href="/" on:click={handleLinkClick} class="tb-logo-link flex items-center gap-4">
					{#if logoUrl}
						<img
							src={logoUrl}
							srcset={logoSrcSet}
							sizes="48px"
							alt="{website.business_name} logo"
							class="h-12 w-auto object-contain"
							loading="eager"
							decoding="async"
						/>
					{:else}
						<div class="flex items-center gap-3">
							<div class="{colors.accent} w-16 h-12 flex items-center justify-center text-2xl font-bold italic">
								{website.business_name.charAt(0)}
							</div>
							<div class="text-2xl font-bold tracking-wider">
								{website.business_name}
							</div>
						</div>
					{/if}
				</a>

				<!-- Contact Info -->
				{#if phoneNumber}
					<div class="tb-contact-info">
						<a href="tel:{phoneNumber}" class="flex items-center justify-center md:justify-end gap-2 text-xl md:text-2xl font-bold {colors.hoverTextAccent} transition-colors">
							<i class="fas fa-phone text-base"></i>
							{phoneNumber}
						</a>
						{#if businessHours}
							<div class="{colors.textAccent} text-xs md:text-sm mt-1 text-center md:text-right">
								{businessHours}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Navigation Bar -->
	<div class="bg-zinc-900">
		<div class="container mx-auto px-4 md:px-8">
			<div class="tb-nav-content py-3 md:py-0">
				<!-- Desktop Navigation -->
				<nav class="tb-desktop-nav">
					<ul class="flex flex-wrap justify-start gap-4 md:gap-8">
						<li>
							<a
								href="/"
								class="block py-4 text-sm font-medium transition-colors {currentPage?.is_home ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
							>
								Home
							</a>
						</li>
						{#each navPages as page}
							{@const hasChildren = childrenByParentId[page.id]?.length > 0}
							{#if hasChildren}
								<li class="relative tb-dropdown-container">
									<a
										href="/{page.slug}"
										on:click={handleLinkClick}
										on:mouseenter={() => toggleDropdown(page.id)}
										on:mouseleave={() => toggleDropdown(null)}
										class="flex items-center gap-1 py-4 text-sm font-medium transition-colors {currentPage && currentPage.id === page.id ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
									>
										{page.title}
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
										</svg>
									</a>

									{#if openDropdown === page.id}
										<div
											on:mouseenter={() => toggleDropdown(page.id)}
											on:mouseleave={() => toggleDropdown(null)}
											class="absolute left-0 top-full mt-0 w-48 bg-zinc-800 rounded-b-lg shadow-lg border border-zinc-600 py-2 z-50"
										>
											{#each childrenByParentId[page.id] as childPage}
												<a
													href="/{childPage.slug}"
													on:click={handleLinkClick}
													class="block px-4 py-2 text-sm text-white {colors.hoverTextAccent} transition-colors {currentPage && currentPage.id === childPage.id ? colors.textAccent : ''}"
												>
													{childPage.title}
												</a>
											{/each}
										</div>
									{/if}
								</li>
							{:else}
								<li>
									<a
										href="/{page.slug}"
										on:click={handleLinkClick}
										class="block py-4 text-sm font-medium transition-colors {currentPage && currentPage.id === page.id ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
									>
										{page.title}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</nav>

				<!-- Right Section: Social + CTA (Desktop) -->
				<div class="tb-nav-right-desktop flex items-center gap-6">
					<!-- Social Icons (desktop only) -->
					{#if website?.contact_details?.social_media}
						<div class="tb-social-icons flex gap-4">
							{#each website.contact_details.social_media.split(',') as social}
								<a href={social.trim()} target="_blank" rel="noopener" class="text-white {colors.hoverTextAccent} transition-colors text-base">
									<i class="fab fa-{social.toLowerCase().includes('facebook') ? 'facebook-f' : social.toLowerCase().includes('instagram') ? 'instagram' : social.toLowerCase().includes('twitter') ? 'twitter' : social.toLowerCase().includes('linkedin') ? 'linkedin-in' : 'link'}"></i>
								</a>
							{/each}
						</div>
					{/if}

					<!-- CTA Button (Desktop) -->
					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class="tb-cta-button {colors.accent} {colors.accentHover} px-7 py-3 text-xs font-bold tracking-wider uppercase transition-colors"
						>
							{ctaLabel}
						</a>
					{/if}
				</div>

				<!-- Mobile: CTA + Hamburger -->
				<div class="tb-nav-mobile flex items-center justify-between gap-3">
					<!-- CTA Button (Mobile - Full Width) -->
					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class="tb-cta-button-mobile flex-1 {colors.accent} {colors.accentHover} px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors text-center"
						>
							{ctaLabel}
						</a>
					{/if}

					<!-- Mobile Menu Button -->
					<button
						on:click={handleMobileLinkClick}
						class="tb-mobile-menu-btn text-white p-2 hover:bg-zinc-800 rounded transition-colors flex-shrink-0"
						aria-label="Toggle menu"
					>
						{#if mobileMenuOpen}
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			{#if mobileMenuOpen}
				<div class="tb-mobile-menu border-t border-zinc-700 py-4">
					<nav>
						<ul class="flex flex-col gap-2">
							<li>
								<a
									href="/"
									on:click={handleMobileLinkClick}
									class="block px-4 py-3 text-sm font-medium transition-colors {currentPage?.is_home ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
								>
									Home
								</a>
							</li>
							{#each navPages as page}
								{@const hasChildren = childrenByParentId[page.id]?.length > 0}
								{#if hasChildren}
									<li class="border-b border-zinc-700 pb-2">
										<a
											href="/{page.slug}"
											on:click={handleMobileLinkClick}
											class="block px-4 py-3 text-sm font-semibold transition-colors {currentPage && currentPage.id === page.id ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
										>
											{page.title}
										</a>
										<ul class="ml-6 mt-1 space-y-1">
											{#each childrenByParentId[page.id] as childPage}
												<li>
													<a
														href="/{childPage.slug}"
														on:click={handleMobileLinkClick}
														class="block px-4 py-2 text-xs font-medium transition-colors {currentPage && currentPage.id === childPage.id ? colors.textAccent : `text-gray-300 ${colors.hoverTextAccent}`}"
													>
														{childPage.title}
													</a>
												</li>
											{/each}
										</ul>
									</li>
								{:else}
									<li>
										<a
											href="/{page.slug}"
											on:click={handleMobileLinkClick}
											class="block px-4 py-3 text-sm font-medium transition-colors {currentPage && currentPage.id === page.id ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
										>
											{page.title}
										</a>
									</li>
								{/if}
							{/each}
						</ul>

						<!-- Mobile Social Icons -->
						{#if website?.contact_details?.social_media}
							<div class="flex justify-center gap-6 mt-6 pt-4 border-t border-gray-800">
								{#each website.contact_details.social_media.split(',') as social}
									<a href={social.trim()} target="_blank" rel="noopener" class="text-white {colors.hoverTextAccent} transition-colors text-lg">
										<i class="fab fa-{social.toLowerCase().includes('facebook') ? 'facebook-f' : social.toLowerCase().includes('instagram') ? 'instagram' : social.toLowerCase().includes('twitter') ? 'twitter' : social.toLowerCase().includes('linkedin') ? 'linkedin-in' : 'link'}"></i>
									</a>
								{/each}
							</div>
						{/if}
					</nav>
				</div>
			{/if}
		</div>
	</div>
</header>

<!-- Spacer to prevent content from going under fixed header -->
<div class="tb-header-2-spacer" style={`height: ${headerSpacerHeight}px;`}></div>

<style>
	/* Mobile Layout */
	@container (max-width: 768px) {
		/* Top bar: Center logo and contact info */
		.tb-top-bar-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.tb-logo-link {
			justify-content: center;
		}

		.tb-contact-info {
			text-align: center;
		}

		/* Nav bar: Hide desktop elements */
		.tb-desktop-nav {
			display: none;
		}

		.tb-nav-right-desktop {
			display: none;
		}

		/* Nav bar: Show mobile elements */
		.tb-nav-mobile {
			display: flex;
		}

		.tb-nav-content {
			display: flex;
			flex-direction: column;
		}
	}

	/* Desktop Layout */
	@container (min-width: 769px) {
		/* Top bar: Flex row layout */
		.tb-top-bar-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.tb-contact-info {
			text-align: right;
		}

		/* Nav bar: Show desktop elements */
		.tb-desktop-nav {
			display: block;
		}

		.tb-nav-right-desktop {
			display: flex;
		}

		/* Nav bar: Hide mobile elements */
		.tb-nav-mobile {
			display: none;
		}

		.tb-mobile-menu {
			display: none !important;
		}

		.tb-nav-content {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	/* Common styles */
	.tb-cta-button,
	.tb-cta-button-mobile {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}
</style>
