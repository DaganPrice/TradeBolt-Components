<script>
	import { onDestroy, onMount } from 'svelte';

	export let website;
	export let pb;
	export let pages = [];
	export let currentPage = null;
	export let data = {};
	export let embed = false;

	let logoUrl = null;
	let logoSrcSet = '';
	let mobileMenuOpen = false;
	let openDropdown = null;
	let closeDropdownTimeout = null;
	let headerEl = null;
	let headerSpacerHeight = 128;
	let headerResizeObserver = null;

	function handleLinkClick(e) {
		if (embed) e.preventDefault();
	}

	function handleMobileLinkClick(e) {
		mobileMenuOpen = false;
		if (embed) e.preventDefault();
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function updateHeaderSpacer() {
		if (!headerEl) return;
		const next = headerEl.offsetHeight || 0;
		if (next > 0) headerSpacerHeight = next;
	}

	function getOrderedNavPages(allPages, orderKeys) {
		const visible = (allPages || []).filter((p) => p?.is_visible && !p?.is_home);
		const order = Array.isArray(orderKeys) ? orderKeys : [];
		if (order.length === 0) return visible;

		const byId = new Map(visible.map((p) => [p.id, p]));
		const bySlug = new Map(visible.map((p) => [p.slug, p]));
		const ordered = order.map((key) => byId.get(key) || bySlug.get(key)).filter(Boolean);
		const orderedIds = new Set(ordered.map((p) => p.id));
		const remaining = visible.filter((p) => !orderedIds.has(p.id));
		return [...ordered, ...remaining];
	}

	function toggleDropdown(pageId) {
		if (closeDropdownTimeout) {
			clearTimeout(closeDropdownTimeout);
			closeDropdownTimeout = null;
		}
		if (pageId === null) {
			closeDropdownTimeout = setTimeout(() => {
				openDropdown = null;
			}, 150);
			return;
		}
		openDropdown = pageId;
	}

	function firstAddressChunk(address) {
		const raw = (address || '').toString().trim();
		if (!raw) return '';
		return raw.split(/[\n,]+/g).map((part) => part.trim()).filter(Boolean)[0] || '';
	}

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				accentText: 'text-orange-400',
				accentBg: 'bg-orange-400 text-black',
				accentHoverBg: 'hover:bg-orange-300'
			},
			red: {
				accentText: 'text-red-400',
				accentBg: 'bg-red-500 text-white',
				accentHoverBg: 'hover:bg-red-400'
			},
			blue: {
				accentText: 'text-blue-400',
				accentBg: 'bg-blue-500 text-white',
				accentHoverBg: 'hover:bg-blue-400'
			},
			green: {
				accentText: 'text-emerald-400',
				accentBg: 'bg-emerald-500 text-white',
				accentHoverBg: 'hover:bg-emerald-400'
			},
			yellow: {
				accentText: 'text-yellow-400',
				accentBg: 'bg-yellow-400 text-black',
				accentHoverBg: 'hover:bg-yellow-300'
			},
			purple: {
				accentText: 'text-purple-400',
				accentBg: 'bg-purple-500 text-white',
				accentHoverBg: 'hover:bg-purple-400'
			},
			pink: {
				accentText: 'text-pink-400',
				accentBg: 'bg-pink-500 text-white',
				accentHoverBg: 'hover:bg-pink-400'
			},
			gray: {
				accentText: 'text-gray-300',
				accentBg: 'bg-gray-200 text-gray-900',
				accentHoverBg: 'hover:bg-white'
			}
		};
		return colorMap[colorScheme] || colorMap.orange;
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

	$: colors = getColorClasses(website?.color_scheme);
	$: allNavPages = getOrderedNavPages(pages, data?.page_nav_order);
	$: navPages = allNavPages.filter((p) => !p.parent_id);
	$: childrenByParentId = allNavPages.reduce((acc, page) => {
		if (page.parent_id) {
			if (!acc[page.parent_id]) acc[page.parent_id] = [];
			acc[page.parent_id].push(page);
		}
		return acc;
	}, {});
	$: isHomeActive = Boolean(currentPage?.is_home);

	$: locationLabel =
		(data?.location_label || '').toString().trim() ||
		firstAddressChunk(website?.contact_details?.address) ||
		'Local & Trusted';
	$: businessHours = (data?.business_hours || '').toString().trim() || 'Mon-Fri: 9:00am - 5:00pm';
	$: email = (website?.contact_details?.email || '').toString().trim();
	$: phone = (website?.contact_details?.phone || '').toString().trim();

	$: showCtaButton = data?.show_cta_button !== false;
	$: ctaLabel =
		data && typeof data.cta_label === 'string' && data.cta_label.trim()
			? data.cta_label.trim()
			: 'Contact Us';
	$: contactPage =
		pages.find((p) => p.is_visible && p.slug === 'contact') ||
		pages.find((p) => p.is_visible && (p.title || '').toLowerCase().includes('contact')) ||
		null;
	$: ctaHref = contactPage ? `/${contactPage.slug}` : '/contact';

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

<header bind:this={headerEl} class="tb-header-4 fixed top-0 left-0 right-0 z-50 text-white">
	<div class="border-b border-white/10 bg-[#0B0C10]">
		<div class="tb-header4-top mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 text-sm">
			<div class="tb-header4-meta flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
				<span class="inline-flex items-center gap-2">
					<svg class={`h-4 w-4 ${colors.accentText}`} viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
					</svg>
					{locationLabel}
				</span>
				{#if email}
					<a
						href={`mailto:${email}`}
						on:click={handleLinkClick}
						class="inline-flex items-center gap-2 transition hover:text-white"
					>
						<svg class={`h-4 w-4 ${colors.accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 6h16v12H4z" />
							<path d="M22 7l-10 7L2 7" />
						</svg>
						{email}
					</a>
				{/if}
				<span class="inline-flex items-center gap-2">
					<svg class={`h-4 w-4 ${colors.accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="9" />
						<path d="M12 7v5l3 3" />
					</svg>
					{businessHours}
				</span>
			</div>

			{#if phone}
				<a
					href={`tel:${phone}`}
					on:click={handleLinkClick}
					class="tb-header4-phone hidden items-center gap-2 text-lg font-semibold text-white transition hover:text-white/85"
				>
					<svg class={`h-4 w-4 ${colors.accentText}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z" />
					</svg>
					{phone}
				</a>
			{/if}
		</div>
	</div>

	<div class="bg-gradient-to-r from-[#15171C] to-[#111317]">
		<div class="tb-header4-shell mx-auto max-w-7xl px-4">
			<div class="tb-header4-main flex items-center gap-5 py-4">
				<a href="/" on:click={handleLinkClick} class="flex items-center">
					{#if logoUrl}
						<img
							src={logoUrl}
							srcset={logoSrcSet}
							sizes="84px"
							alt={`${website.business_name} logo`}
							class="tb-header4-logo h-16 w-16 rounded-full border border-white/20 bg-white object-cover"
							loading="eager"
							decoding="async"
						/>
					{:else}
						<div class="grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-bold text-gray-900">
							{(website?.business_name || 'B').charAt(0)}
						</div>
					{/if}
				</a>

				<nav class="tb-header4-desktop-nav flex-1">
					<ul class="flex items-center justify-center gap-8">
						<li>
							<a
								href="/"
								on:click={handleLinkClick}
								class={`inline-flex h-14 items-center border-b-[3px] text-sm font-semibold transition-colors ${
									isHomeActive
										? `${colors.accentText} border-current`
										: 'border-transparent text-white hover:text-white/80'
								}`}
							>
								Home
							</a>
						</li>
						{#each navPages as page}
							{@const hasChildren = childrenByParentId[page.id]?.length > 0}
							{#if hasChildren}
								<li class="relative tb-dropdown-container">
									<a
										href={`/${page.slug}`}
										on:click={handleLinkClick}
										on:mouseenter={() => toggleDropdown(page.id)}
										on:mouseleave={() => toggleDropdown(null)}
										class={`inline-flex h-14 items-center gap-2 border-b-[3px] text-sm font-semibold transition-colors ${
											currentPage && currentPage.id === page.id
												? `${colors.accentText} border-current`
												: 'border-transparent text-white hover:text-white/80'
										}`}
									>
										{page.title}
										<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M6 9l6 6 6-6" />
										</svg>
									</a>
									{#if openDropdown === page.id}
										<div
											on:mouseenter={() => toggleDropdown(page.id)}
											on:mouseleave={() => toggleDropdown(null)}
											class="absolute left-0 top-full min-w-52 rounded-md border border-white/10 bg-[#171A21] py-2 shadow-xl"
										>
											{#each childrenByParentId[page.id] as childPage}
												<a
													href={`/${childPage.slug}`}
													on:click={handleLinkClick}
													class={`block px-4 py-2 text-sm transition-colors ${
														currentPage && currentPage.id === childPage.id
															? `${colors.accentText}`
															: 'text-white hover:text-white/80'
													}`}
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
										href={`/${page.slug}`}
										on:click={handleLinkClick}
										class={`inline-flex h-14 items-center border-b-[3px] text-sm font-semibold transition-colors ${
											currentPage && currentPage.id === page.id
												? `${colors.accentText} border-current`
												: 'border-transparent text-white hover:text-white/80'
										}`}
									>
										{page.title}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</nav>

				<div class="tb-header4-right flex items-center justify-end">
					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleLinkClick}
							class={`inline-flex items-center justify-center rounded-md px-7 py-3 text-sm font-semibold transition-colors ${colors.accentBg} ${colors.accentHoverBg}`}
						>
							{ctaLabel}
						</a>
					{/if}
				</div>

				<div class="tb-header4-mobile-toggle ml-auto">
					<button
						type="button"
						on:click={toggleMobileMenu}
						class="rounded border border-white/20 p-2 text-white transition hover:bg-white/10"
						aria-label="Toggle navigation menu"
					>
						{#if mobileMenuOpen}
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M6 6l12 12M18 6L6 18" />
							</svg>
						{:else}
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M4 7h16M4 12h16M4 17h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			{#if mobileMenuOpen}
				<div class="tb-header4-mobile-menu border-t border-white/10 py-3">
					<nav>
						<ul class="space-y-1">
							<li>
								<a
									href="/"
									on:click={handleMobileLinkClick}
									class={`block rounded px-3 py-2 text-sm font-medium ${
										isHomeActive ? `${colors.accentText} bg-white/5` : 'text-white hover:bg-white/5'
									}`}
								>
									Home
								</a>
							</li>
							{#each navPages as page}
								{@const hasChildren = childrenByParentId[page.id]?.length > 0}
								<li>
									<a
										href={`/${page.slug}`}
										on:click={handleMobileLinkClick}
										class={`block rounded px-3 py-2 text-sm font-medium ${
											currentPage && currentPage.id === page.id
												? `${colors.accentText} bg-white/5`
												: 'text-white hover:bg-white/5'
										}`}
									>
										{page.title}
									</a>
									{#if hasChildren}
										<ul class="ml-4 space-y-1 pb-2">
											{#each childrenByParentId[page.id] as childPage}
												<li>
													<a
														href={`/${childPage.slug}`}
														on:click={handleMobileLinkClick}
														class={`block rounded px-3 py-2 text-xs ${
															currentPage && currentPage.id === childPage.id
																? `${colors.accentText} bg-white/5`
																: 'text-white/85 hover:bg-white/5'
														}`}
													>
														{childPage.title}
													</a>
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ul>
						{#if showCtaButton}
							<a
								href={ctaHref}
								on:click={handleMobileLinkClick}
								class={`mt-3 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold ${colors.accentBg} ${colors.accentHoverBg}`}
							>
								{ctaLabel}
							</a>
						{/if}
					</nav>
				</div>
			{/if}
		</div>
	</div>
</header>

<div class="tb-header-4-spacer" style={`height: ${headerSpacerHeight}px;`}></div>

<style>
	@container (max-width: 768px) {
		.tb-header4-meta {
			font-size: 12px;
		}

		.tb-header4-desktop-nav,
		.tb-header4-right {
			display: none;
		}

		.tb-header4-mobile-toggle {
			display: block;
		}

		.tb-header4-shell,
		.tb-header4-top {
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}

	@container (min-width: 769px) {
		.tb-header4-mobile-toggle,
		.tb-header4-mobile-menu {
			display: none;
		}

		.tb-header4-phone {
			display: inline-flex;
		}

		.tb-header4-logo {
			height: 6rem;
			width: 6rem;
		}

		.tb-header4-shell,
		.tb-header4-top {
			padding-left: 1.5rem;
			padding-right: 1.5rem;
		}
	}
</style>
