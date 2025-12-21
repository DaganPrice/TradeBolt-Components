<script>
	export let website;
	export let pb;
	export let pages = []; // Array of pages for multi-page navigation
	export let currentPage = null; // Current page being viewed
	export let sections = []; // Sections on the current page (for jump links)
	export let data = {}; // Optional header section data
	export let embed = false; // Whether this is rendered in preview/embed mode

	let logoUrl = null;
	let logoSrcSet = '';
	let mobileMenuOpen = false;
	let openDropdown = null;
	let closeDropdownTimeout = null;

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

	function sortPagesByOrder(list) {
		const items = Array.isArray(list) ? [...list] : [];
		return items.sort((a, b) => {
			const ao = Number(a?.order ?? 0);
			const bo = Number(b?.order ?? 0);
			if (ao !== bo) return ao - bo;
			return String(a?.title || '').localeCompare(String(b?.title || ''));
		});
	}

	function getOrderedNavPages(allPages, orderKeys) {
		const visible = sortPagesByOrder((allPages || []).filter((p) => p?.is_visible && !p?.is_home));
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
	$: {
		for (const parentId in childrenByParentId) {
			childrenByParentId[parentId] = sortPagesByOrder(childrenByParentId[parentId]);
		}
	}

	$: isHomeActive = Boolean(currentPage?.is_home);

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
		<div class="flex h-24 items-center justify-between">
			<!-- Logo / Business Name -->
			<a href="/" class="flex flex-shrink-0 items-center space-x-3" on:click={handleLinkClick}>
				{#if logoUrl}
					<img
						src={logoUrl}
						srcset={logoSrcSet}
						sizes="96px"
						alt="{website.business_name} logo"
						class="h-24 w-auto object-contain"
						loading="eager"
						decoding="async"
					/>
				{:else}
					<span class="text-xl font-bold text-gray-900">{website.business_name}</span>
				{/if}
			</a>

			<div class="flex items-center gap-8">
				<!-- Desktop Navigation -->
				<div class="tb-nav-desktop items-center gap-8">
					<a
						href="/"
						on:click={handleLinkClick}
						class="text-gray-700 {colors.hover} font-medium transition-colors {isHomeActive ? 'font-bold ' + colors.text : ''}"
					>
						Home
					</a>
					{#each navPages as page}
						{@const hasChildren = childrenByParentId[page.id]?.length > 0}
						{#if hasChildren}
							<!-- Parent page with dropdown -->
							<div class="relative tb-dropdown-container">
								<a
									href="/{page.slug}"
									on:click={handleLinkClick}
									on:mouseenter={() => toggleDropdown(page.id)}
									on:mouseleave={() => toggleDropdown(null)}
									class="flex items-center gap-1 text-gray-700 {colors.hover} font-medium transition-colors {currentPage &&
									currentPage.id === page.id
										? 'font-bold ' + colors.text
										: ''}"
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
										class="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
									>
										{#each childrenByParentId[page.id] as childPage}
											<a
												href="/{childPage.slug}"
												on:click={handleLinkClick}
												class="block px-4 py-2 text-gray-700 {colors.hover} transition-colors {currentPage &&
												currentPage.id === childPage.id
													? 'font-bold ' + colors.text
													: ''}"
											>
												{childPage.title}
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{:else}
							<!-- Regular page link -->
							<a
								href="/{page.slug}"
								on:click={handleLinkClick}
								class="text-gray-700 {colors.hover} font-medium transition-colors {currentPage &&
								currentPage.id === page.id
									? 'font-bold ' + colors.text
									: ''}"
							>
								{page.title}
							</a>
						{/if}
					{/each}
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

					<a
						href="/"
						on:click={handleMobileLinkClick}
						class="text-gray-700 {colors.hover} px-2 font-medium transition-colors {isHomeActive ? 'font-bold ' + colors.text : ''}"
					>
						Home
					</a>

					{#each navPages as page}
						{@const hasChildren = childrenByParentId[page.id]?.length > 0}
						{#if hasChildren}
							<!-- Parent with children -->
							<div class="border-b border-gray-100 pb-2">
								<a
									href="/{page.slug}"
									on:click={handleMobileLinkClick}
									class="text-gray-700 {colors.hover} px-2 font-semibold transition-colors block mb-2 {currentPage &&
									currentPage.id === page.id
										? 'font-bold ' + colors.text
										: ''}"
								>
									{page.title}
								</a>
								<div class="ml-4 space-y-2">
									{#each childrenByParentId[page.id] as childPage}
										<a
											href="/{childPage.slug}"
											on:click={handleMobileLinkClick}
											class="text-gray-600 {colors.hover} px-2 text-sm font-medium transition-colors block {currentPage &&
											currentPage.id === childPage.id
												? 'font-bold ' + colors.text
												: ''}"
										>
											{childPage.title}
										</a>
									{/each}
								</div>
							</div>
						{:else}
							<!-- Regular link -->
							<a
								href="/{page.slug}"
								on:click={handleMobileLinkClick}
								class="text-gray-700 {colors.hover} px-2 font-medium transition-colors {currentPage &&
								currentPage.id === page.id
									? 'font-bold ' + colors.text
									: ''}"
							>
								{page.title}
							</a>
						{/if}
					{/each}
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
