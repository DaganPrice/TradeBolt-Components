<script>
	export let website;
	export let pb;
	export let pages = [];
	export let currentPage = null;
	export let sections = [];
	export let data = {};

	let logoUrl = null;
	let logoSrcSet = '';
	let mobileMenuOpen = false;
	let openDropdown = null;
	let closeDropdownTimeout = null;

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

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

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
	$: isMultiPage = navPages.length > 0;

	$: allSectionTypes = [...new Set(sections.filter((s) => s.is_visible).map((s) => s.section_type))];

	$: sectionTypes = (() => {
		const navOrder = data?.nav_order;
		if (navOrder && Array.isArray(navOrder) && navOrder.length > 0) {
			return navOrder.filter((type) => allSectionTypes.includes(type));
		}
		return allSectionTypes;
	})();

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

	function scrollToSection(sectionId) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		closeMobileMenu();
	}

	function handleNavClick(event, page) {
		if (!isMultiPage) {
			event.preventDefault();
			scrollToSection(page.slug.replace('-', ''));
			return;
		}
		closeMobileMenu();
	}

	function handleCtaClick(event) {
		if (!showCtaButton) return;

		const isOnContactPage = !!(contactPage && currentPage && contactPage.id === currentPage.id);
		if (!isMultiPage || isOnContactPage) {
			event.preventDefault();
			scrollToSection('contact');
		}

		closeMobileMenu();
	}

	$: email = website?.contact_details?.email || '';
	$: phone = website?.contact_details?.phone || '';

	function getTheme(colorScheme = 'orange') {
		const map = {
			orange: {
				topBg: 'bg-orange-950',
				topBorder: 'border-orange-800',
				accent: 'bg-orange-500 text-white',
				accentHover: 'hover:bg-orange-600',
				topHover: 'hover:text-orange-200',
				linkActive: 'text-orange-600',
				linkHover: 'hover:text-orange-600'
			},
			red: {
				topBg: 'bg-red-950',
				topBorder: 'border-red-800',
				accent: 'bg-red-500 text-white',
				accentHover: 'hover:bg-red-600',
				topHover: 'hover:text-red-200',
				linkActive: 'text-red-600',
				linkHover: 'hover:text-red-600'
			},
			blue: {
				topBg: 'bg-blue-950',
				topBorder: 'border-blue-800',
				accent: 'bg-blue-500 text-white',
				accentHover: 'hover:bg-blue-600',
				topHover: 'hover:text-blue-200',
				linkActive: 'text-blue-600',
				linkHover: 'hover:text-blue-600'
			},
			green: {
				topBg: 'bg-emerald-950',
				topBorder: 'border-emerald-800',
				accent: 'bg-emerald-500 text-white',
				accentHover: 'hover:bg-emerald-600',
				topHover: 'hover:text-emerald-200',
				linkActive: 'text-emerald-600',
				linkHover: 'hover:text-emerald-600'
			},
			yellow: {
				topBg: 'bg-yellow-950',
				topBorder: 'border-yellow-800',
				accent: 'bg-yellow-400 text-black',
				accentHover: 'hover:bg-yellow-500',
				topHover: 'hover:text-yellow-200',
				linkActive: 'text-yellow-700',
				linkHover: 'hover:text-yellow-700'
			},
			purple: {
				topBg: 'bg-purple-950',
				topBorder: 'border-purple-800',
				accent: 'bg-purple-500 text-white',
				accentHover: 'hover:bg-purple-600',
				topHover: 'hover:text-purple-200',
				linkActive: 'text-purple-600',
				linkHover: 'hover:text-purple-600'
			},
			pink: {
				topBg: 'bg-pink-950',
				topBorder: 'border-pink-800',
				accent: 'bg-pink-500 text-white',
				accentHover: 'hover:bg-pink-600',
				topHover: 'hover:text-pink-200',
				linkActive: 'text-pink-600',
				linkHover: 'hover:text-pink-600'
			},
			gray: {
				topBg: 'bg-gray-950',
				topBorder: 'border-gray-800',
				accent: 'bg-gray-200 text-gray-900',
				accentHover: 'hover:bg-white',
				topHover: 'hover:text-white',
				linkActive: 'text-gray-900',
				linkHover: 'hover:text-gray-900'
			}
		};

		return map[colorScheme] || map.orange;
	}

	$: theme = getTheme(website?.color_scheme);
</script>

<!-- Header3: top contact bar + main nav (logo, links, CTA, hamburger) -->
<header class="tb-header-3 text-white shadow-md">
	<!-- Top Bar -->
	<div class={`tb-header3-top ${theme.topBg} border-b ${theme.topBorder}`}>
		<div class="mx-auto max-w-7xl px-6">
			<div class="flex flex-col gap-2 py-2 tb-header3-top-inner">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-4 text-xs text-white/90">
						{#if email}
							<a
								href="mailto:{email}"
								class={`flex items-center gap-2 transition ${theme.topHover}`}
							>
								<svg
									viewBox="0 0 24 24"
									aria-hidden="true"
									class="h-4 w-4 text-white/80"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M4 4h16v16H4z" />
									<path d="m4 6 8 7 8-7" />
								</svg>
								<span class="min-w-0 truncate">{email}</span>
							</a>
						{/if}
						{#if phone}
							<a
								href="tel:{phone}"
								class={`flex items-center gap-2 transition ${theme.topHover}`}
							>
								<svg
									viewBox="0 0 24 24"
									aria-hidden="true"
									class="h-4 w-4 text-white/80"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z"
									/>
								</svg>
								<span class="whitespace-nowrap">{phone}</span>
							</a>
						{/if}
					</div>
					<div class="hidden tb-header3-top-right items-center gap-3 text-xs text-white/80">
						{#if website?.contact_details?.address}
							<span class="max-w-96 truncate">
								<svg
									viewBox="0 0 24 24"
									aria-hidden="true"
									class="mr-1 inline-block h-4 w-4 align-text-bottom text-white/70"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M12 21s-7-4.5-7-11a7 7 0 0 1 14 0c0 6.5-7 11-7 11z" />
									<circle cx="12" cy="10" r="2.5" />
								</svg>{website.contact_details.address}
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Bar -->
	<nav class="tb-header3-main bg-white text-gray-900">
		<div class="mx-auto max-w-7xl px-6">
			<div class="flex items-center justify-between gap-4 py-4">
				<!-- Logo -->
				<a
					href={isMultiPage ? '/' : '#hero'}
					on:click={isMultiPage
						? closeMobileMenu
						: (e) => {
								e.preventDefault();
								scrollToSection('hero');
							}}
					class="inline-flex items-center"
					aria-label="Go to homepage"
				>
					{#if logoUrl}
						<img
							src={logoUrl}
							srcset={logoSrcSet}
							sizes="56px"
							alt="{website.business_name} logo"
							class="tb-header3-logo h-14 w-auto object-contain"
							loading="eager"
							decoding="async"
						/>
					{:else}
						<div class="tb-header3-logo-fallback h-14 w-14 rounded-lg bg-white/10 flex items-center justify-center">
							<span class="text-2xl font-bold text-gray-900">
								{website?.business_name?.charAt(0) || 'T'}
							</span>
						</div>
					{/if}
				</a>

				<!-- Desktop nav + CTA -->
				<div class="tb-header3-desktop items-center justify-end gap-8">
					<ul class="flex items-center gap-8">
						{#if isMultiPage}
							<li>
								<a
									href="/"
									class={`text-[15px] font-medium transition text-gray-700 ${
										currentPage?.is_home ? theme.linkActive : theme.linkHover
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
											href="/{page.slug}"
											on:mouseenter={() => toggleDropdown(page.id)}
											on:mouseleave={() => toggleDropdown(null)}
											class={`flex items-center gap-1 text-[15px] font-medium transition text-gray-700 ${
												currentPage && currentPage.id === page.id
													? theme.linkActive
													: theme.linkHover
											}`}
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
														class={`block px-4 py-2 text-sm transition text-gray-700 ${
															currentPage && currentPage.id === childPage.id
																? theme.linkActive
																: theme.linkHover
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
											href="/{page.slug}"
											class={`text-[15px] font-medium transition text-gray-700 ${
												currentPage && currentPage.id === page.id
													? theme.linkActive
													: theme.linkHover
											}`}
										>
											{page.title}
										</a>
									</li>
								{/if}
							{/each}
						{:else}
							{#each sectionTypes as sectionType}
								{#if sectionType !== 'header' && sectionType !== 'hero' && sectionType !== 'footer'}
									<li>
										<a
											href="#{sectionType}"
											on:click|preventDefault={() => scrollToSection(sectionType)}
											class={`text-[15px] font-medium text-gray-700 transition ${theme.linkHover}`}
										>
											{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
										</a>
									</li>
								{/if}
							{/each}
						{/if}
					</ul>

					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class={`tb-header3-cta ${theme.accent} ${theme.accentHover}`}
						>
							<i class="far fa-envelope"></i>
							{ctaLabel}
						</a>
					{/if}
				</div>

				<!-- Mobile CTA + Hamburger -->
				<div class="tb-header3-mobile-actions flex items-center gap-2">
					{#if showCtaButton}
						<a
							href={ctaHref}
							on:click={handleCtaClick}
							class={`tb-header3-cta ${theme.accent} ${theme.accentHover}`}
						>
							<i class="far fa-envelope"></i>
							{ctaLabel}
						</a>
					{/if}
					<button
						type="button"
						class="tb-header3-burger"
						aria-label="Toggle menu"
						on:click={toggleMobileMenu}
					>
						{#if mobileMenuOpen}
							<svg
								viewBox="0 0 24 24"
								aria-hidden="true"
								class="tb-header3-burger-icon"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="M6 6l12 12" />
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								aria-hidden="true"
								class="tb-header3-burger-icon"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M4 6h16" />
								<path d="M4 12h16" />
								<path d="M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			{#if mobileMenuOpen}
				<div class="tb-header3-mobile border-t border-gray-200 bg-white">
					<div class="flex flex-col gap-2 py-4">
						{#if isMultiPage}
							<a
								href="/"
								on:click={closeMobileMenu}
								class={`rounded-lg px-3 py-2 text-sm font-medium transition text-gray-900 ${
									currentPage?.is_home ? 'bg-gray-100' : 'hover:bg-gray-50'
								} ${currentPage?.is_home ? theme.linkActive : ''}`}
							>
								Home
							</a>
							{#each navPages as page}
								{@const hasChildren = childrenByParentId[page.id]?.length > 0}
								{#if hasChildren}
									<div class="border-b border-gray-100 pb-2 mb-2">
										<a
											href="/{page.slug}"
											on:click={closeMobileMenu}
											class={`rounded-lg px-3 py-2 text-sm font-semibold transition text-gray-900 block ${
												currentPage && currentPage.id === page.id
													? 'bg-gray-100'
													: 'hover:bg-gray-50'
											} ${currentPage && currentPage.id === page.id ? theme.linkActive : ''}`}
										>
											{page.title}
										</a>
										<div class="ml-4 mt-1 space-y-1">
											{#each childrenByParentId[page.id] as childPage}
												<a
													href="/{childPage.slug}"
													on:click={closeMobileMenu}
													class={`rounded-lg px-3 py-2 text-xs font-medium transition text-gray-700 block ${
														currentPage && currentPage.id === childPage.id
															? 'bg-gray-100'
															: 'hover:bg-gray-50'
													} ${currentPage && currentPage.id === childPage.id ? theme.linkActive : ''}`}
												>
													{childPage.title}
												</a>
											{/each}
										</div>
									</div>
								{:else}
									<a
										href="/{page.slug}"
										on:click={closeMobileMenu}
										class={`rounded-lg px-3 py-2 text-sm font-medium transition text-gray-900 ${
											currentPage && currentPage.id === page.id
												? 'bg-gray-100'
												: 'hover:bg-gray-50'
										}`}
									>
										{page.title}
									</a>
								{/if}
							{/each}
						{:else}
							{#each sectionTypes as sectionType}
								{#if sectionType !== 'header' && sectionType !== 'hero' && sectionType !== 'footer'}
									<a
										href="#{sectionType}"
										on:click|preventDefault={() => scrollToSection(sectionType)}
										class="rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
									>
										{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
									</a>
								{/if}
							{/each}
						{/if}

						{#if email || phone}
							<div class="mt-3 grid gap-2">
								{#if email}
									<a
										href="mailto:{email}"
										on:click={closeMobileMenu}
										class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 transition hover:bg-gray-100"
									>
										<i class="far fa-envelope"></i>
										<span class="min-w-0 truncate">{email}</span>
									</a>
								{/if}
								{#if phone}
									<a
										href="tel:{phone}"
										on:click={closeMobileMenu}
										class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-900 transition hover:bg-gray-100"
									>
										<i class="fas fa-phone"></i>
										<span class="whitespace-nowrap">{phone}</span>
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</nav>
</header>

<style>
	/* Match Header2 builder breakpoints (container width <= 768px is "mobile"). */
	.tb-header3-desktop {
		display: flex;
	}

	.tb-header3-top-right {
		display: flex;
	}

	.tb-header3-mobile-actions {
		display: none;
	}

	@container (max-width: 768px) {
		.tb-header3-desktop {
			display: none;
		}

		.tb-header3-top-right {
			display: none;
		}

		.tb-header3-mobile-actions {
			display: flex;
		}
	}

	.tb-header3-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border-radius: 0.75rem;
		font-weight: 700;
		font-size: 0.875rem;
		white-space: nowrap;
		box-shadow: 0 10px 22px rgba(0, 0, 0, 0.25);
	}

	.tb-header3-burger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border-radius: 0.75rem;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: rgba(17, 24, 39, 0.04);
		color: rgb(17 24 39);
		transition: background 0.15s ease;
	}

	.tb-header3-burger:hover {
		background: rgba(17, 24, 39, 0.08);
	}

	.tb-header3-burger-icon {
		width: 22px;
		height: 22px;
		display: block;
	}
</style>
