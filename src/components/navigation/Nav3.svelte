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

	$: navPages = getOrderedNavPages(pages, data?.page_nav_order);
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
								<i class="far fa-envelope"></i>
								<span class="min-w-0 truncate">{email}</span>
							</a>
						{/if}
						{#if phone}
							<a
								href="tel:{phone}"
								class={`flex items-center gap-2 transition ${theme.topHover}`}
							>
								<i class="fas fa-phone"></i>
								<span class="whitespace-nowrap">{phone}</span>
							</a>
						{/if}
					</div>
					<div class="hidden tb-header3-top-right items-center gap-3 text-xs text-white/80">
						{#if website?.contact_details?.address}
							<span class="max-w-96 truncate">
								<i class="fa-solid fa-location-dot mr-1"></i>{website.contact_details.address}
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
						<i class={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
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
		padding: 0.75rem;
		border-radius: 0.75rem;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: rgba(17, 24, 39, 0.04);
		color: rgb(17 24 39);
		transition: background 0.15s ease;
	}

	.tb-header3-burger:hover {
		background: rgba(17, 24, 39, 0.08);
	}
</style>
