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

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				accent: 'bg-orange-500 text-white',
				accentHover: 'hover:bg-orange-600',
				textAccent: 'text-orange-400',
				hoverTextAccent: 'hover:text-orange-300'
			},
			red: {
				accent: 'bg-red-500 text-white',
				accentHover: 'hover:bg-red-600',
				textAccent: 'text-red-400',
				hoverTextAccent: 'hover:text-red-300'
			},
			blue: {
				accent: 'bg-blue-500 text-white',
				accentHover: 'hover:bg-blue-600',
				textAccent: 'text-blue-400',
				hoverTextAccent: 'hover:text-blue-300'
			},
			green: {
				accent: 'bg-green-500 text-white',
				accentHover: 'hover:bg-green-600',
				textAccent: 'text-green-400',
				hoverTextAccent: 'hover:text-green-300'
			},
			yellow: {
				accent: 'bg-yellow-500 text-black',
				accentHover: 'hover:bg-yellow-600',
				textAccent: 'text-yellow-400',
				hoverTextAccent: 'hover:text-yellow-300'
			},
			purple: {
				accent: 'bg-purple-500 text-white',
				accentHover: 'hover:bg-purple-600',
				textAccent: 'text-purple-400',
				hoverTextAccent: 'hover:text-purple-300'
			},
			pink: {
				accent: 'bg-pink-500 text-white',
				accentHover: 'hover:bg-pink-600',
				textAccent: 'text-pink-400',
				hoverTextAccent: 'hover:text-pink-300'
			},
			gray: {
				accent: 'bg-gray-500 text-white',
				accentHover: 'hover:bg-gray-600',
				textAccent: 'text-gray-300',
				hoverTextAccent: 'hover:text-white'
			}
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website?.color_scheme);

	$: email = website?.contact_details?.email || '';
	$: phone = website?.contact_details?.phone || '';

	function getTheme(colorScheme = 'orange') {
		const map = {
			orange: {
				topBg: 'bg-orange-950',
				mainBg: 'bg-orange-900',
				border: 'border-orange-800',
				accent: 'bg-orange-500 text-white',
				accentHover: 'hover:bg-orange-600',
				hoverTextAccent: 'hover:text-orange-200',
				textAccent: 'text-orange-200'
			},
			red: {
				topBg: 'bg-red-950',
				mainBg: 'bg-red-900',
				border: 'border-red-800',
				accent: 'bg-red-500 text-white',
				accentHover: 'hover:bg-red-600',
				hoverTextAccent: 'hover:text-red-200',
				textAccent: 'text-red-200'
			},
			blue: {
				topBg: 'bg-blue-950',
				mainBg: 'bg-blue-900',
				border: 'border-blue-800',
				accent: 'bg-blue-500 text-white',
				accentHover: 'hover:bg-blue-600',
				hoverTextAccent: 'hover:text-blue-200',
				textAccent: 'text-blue-200'
			},
			green: {
				topBg: 'bg-emerald-950',
				mainBg: 'bg-emerald-900',
				border: 'border-emerald-800',
				accent: 'bg-emerald-500 text-white',
				accentHover: 'hover:bg-emerald-600',
				hoverTextAccent: 'hover:text-emerald-200',
				textAccent: 'text-emerald-200'
			},
			yellow: {
				topBg: 'bg-yellow-950',
				mainBg: 'bg-yellow-900',
				border: 'border-yellow-800',
				accent: 'bg-yellow-400 text-black',
				accentHover: 'hover:bg-yellow-500',
				hoverTextAccent: 'hover:text-yellow-200',
				textAccent: 'text-yellow-200'
			},
			purple: {
				topBg: 'bg-purple-950',
				mainBg: 'bg-purple-900',
				border: 'border-purple-800',
				accent: 'bg-purple-500 text-white',
				accentHover: 'hover:bg-purple-600',
				hoverTextAccent: 'hover:text-purple-200',
				textAccent: 'text-purple-200'
			},
			pink: {
				topBg: 'bg-pink-950',
				mainBg: 'bg-pink-900',
				border: 'border-pink-800',
				accent: 'bg-pink-500 text-white',
				accentHover: 'hover:bg-pink-600',
				hoverTextAccent: 'hover:text-pink-200',
				textAccent: 'text-pink-200'
			},
			gray: {
				topBg: 'bg-gray-950',
				mainBg: 'bg-gray-900',
				border: 'border-gray-800',
				accent: 'bg-gray-200 text-gray-900',
				accentHover: 'hover:bg-white',
				hoverTextAccent: 'hover:text-white',
				textAccent: 'text-gray-100'
			}
		};

		return map[colorScheme] || map.orange;
	}

	$: theme = getTheme(website?.color_scheme);
</script>

<!-- Header3: top contact bar + main nav (logo, links, CTA, hamburger) -->
<header class="tb-header-3 text-white shadow-md">
	<!-- Top Bar -->
	<div class={`tb-header3-top ${theme.topBg} border-b ${theme.border}`}>
		<div class="mx-auto max-w-7xl px-6">
			<div class="flex flex-col gap-2 py-2 tb-header3-top-inner">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex flex-wrap items-center gap-4 text-xs text-white/90">
						{#if email}
							<a
								href="mailto:{email}"
								class={`flex items-center gap-2 transition ${theme.hoverTextAccent}`}
							>
								<i class="far fa-envelope"></i>
								<span class="min-w-0 truncate">{email}</span>
							</a>
						{/if}
						{#if phone}
							<a
								href="tel:{phone}"
								class={`flex items-center gap-2 transition ${theme.hoverTextAccent}`}
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
	<nav class={`tb-header3-main ${theme.mainBg}`}>
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
							<span class={`text-2xl font-bold ${theme.textAccent}`}>
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
									class={`text-[15px] font-medium transition ${
										currentPage?.is_home ? theme.textAccent : `text-white ${theme.hoverTextAccent}`
									}`}
								>
									Home
								</a>
							</li>
							{#each navPages as page}
								<li>
									<a
										href="/{page.slug}"
										class={`text-[15px] font-medium transition ${
											currentPage && currentPage.id === page.id
												? theme.textAccent
												: `text-white ${theme.hoverTextAccent}`
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
											class={`text-[15px] font-medium text-white transition ${theme.hoverTextAccent}`}
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
				<div class={`tb-header3-mobile border-t ${theme.border}`}>
					<div class="flex flex-col gap-2 py-4">
						{#if isMultiPage}
							<a
								href="/"
								on:click={closeMobileMenu}
								class={`rounded-lg px-3 py-2 text-sm font-medium transition ${
									currentPage?.is_home ? `bg-white/10 ${theme.textAccent}` : `text-white hover:bg-white/5`
								}`}
							>
								Home
							</a>
							{#each navPages as page}
								<a
									href="/{page.slug}"
									on:click={closeMobileMenu}
									class={`rounded-lg px-3 py-2 text-sm font-medium transition ${
										currentPage && currentPage.id === page.id
											? `bg-white/10 ${theme.textAccent}`
											: 'text-white hover:bg-white/5'
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
										class="rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/5"
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
										class="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
									>
										<i class="far fa-envelope"></i>
										<span class="min-w-0 truncate">{email}</span>
									</a>
								{/if}
								{#if phone}
									<a
										href="tel:{phone}"
										on:click={closeMobileMenu}
										class="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
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
	/* Container-query responsive behavior (builder device preview friendly). */
	.tb-header3-desktop {
		display: none;
	}

	.tb-header3-top-right {
		display: none;
	}

	@container (min-width: 900px) {
		.tb-header3-desktop {
			display: flex;
		}

		.tb-header3-top-right {
			display: flex;
		}

		.tb-header3-burger {
			display: none;
		}

		.tb-header3-mobile-actions {
			display: none;
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
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.05);
		color: white;
		transition: background 0.15s ease;
	}

	.tb-header3-burger:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
