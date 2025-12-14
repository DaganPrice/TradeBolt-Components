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
</script>

<!-- Header3: dark header with logo, nav, contact details, CTA, and mobile hamburger -->
<nav class="tb-header-3 bg-slate-900 text-white shadow-md">
	<div class="mx-auto max-w-7xl px-6">
		<div class="flex items-center justify-between gap-4 py-5">
			<!-- Logo Section -->
			<a
				href={isMultiPage ? '/' : '#hero'}
				on:click={isMultiPage
					? closeMobileMenu
					: (e) => {
							e.preventDefault();
							scrollToSection('hero');
						}}
				class="flex min-w-0 items-center gap-4"
			>
				{#if logoUrl}
					<div class="rounded-lg bg-slate-800 p-3">
						<img
							src={logoUrl}
							srcset={logoSrcSet}
							sizes="56px"
							alt="{website.business_name} logo"
							class="h-14 w-auto object-contain"
							loading="eager"
							decoding="async"
						/>
					</div>
				{:else}
					<div
						class={`flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 text-2xl font-bold ${colors.textAccent}`}
					>
						{website?.business_name?.charAt(0) || 'T'}
					</div>
				{/if}
				<div class="min-w-0">
					<div class="truncate text-xl font-bold leading-tight text-white">
						{website.business_name}
					</div>
					<div class="truncate text-sm font-medium text-slate-300">
						Professional services
					</div>
				</div>
			</a>

			<!-- Navigation and Contact Section -->
			<div class="flex items-center gap-3">
				<div class="tb-header3-desktop items-center gap-8">
					<!-- Navigation Menu -->
					<ul class="flex items-center gap-8">
						{#if isMultiPage}
							<li>
								<a
									href="/"
									class={`text-[15px] font-medium transition ${
										currentPage?.is_home ? colors.textAccent : `text-white ${colors.hoverTextAccent}`
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
												? colors.textAccent
												: `text-white ${colors.hoverTextAccent}`
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
											class={`text-[15px] font-medium text-white transition ${colors.hoverTextAccent}`}
										>
											{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
										</a>
									</li>
								{/if}
							{/each}
						{/if}
					</ul>

					<!-- Contact Information -->
					<div class="tb-header3-contact items-center gap-6">
						{#if email}
							<a
								href="mailto:{email}"
								class={`flex items-center gap-2 text-sm text-white transition ${colors.hoverTextAccent}`}
							>
								<i class="far fa-envelope"></i>
								<span class="max-w-48 truncate">{email}</span>
							</a>
						{/if}
						{#if phone}
							<a
								href="tel:{phone}"
								class={`flex items-center gap-2 text-sm text-white transition ${colors.hoverTextAccent}`}
							>
								<i class="fas fa-phone"></i>
								<span class="whitespace-nowrap">{phone}</span>
							</a>
						{/if}
					</div>
				</div>

				<!-- CTA Button -->
				{#if showCtaButton}
					<a
						href={ctaHref}
						on:click={handleCtaClick}
						class={`tb-header3-cta ${colors.accent} ${colors.accentHover} shadow-lg px-6 py-3 rounded-lg font-semibold text-sm transition flex items-center gap-2`}
					>
						<i class="far fa-envelope"></i>
						{ctaLabel}
					</a>
				{/if}

				<!-- Mobile Menu Button -->
				<button
					type="button"
					class="tb-header3-burger inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-white transition hover:bg-white/10"
					aria-label="Toggle menu"
					on:click={toggleMobileMenu}
				>
					<i class={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
				</button>
			</div>
		</div>

		{#if mobileMenuOpen}
			<div class="tb-header3-mobile border-t border-white/10 pb-6">
				<div class="flex flex-col gap-3 pt-4">
					{#if isMultiPage}
						<a
							href="/"
							on:click={closeMobileMenu}
							class={`rounded-lg px-3 py-2 text-sm font-medium transition ${
								currentPage?.is_home ? `bg-white/10 ${colors.textAccent}` : `text-white hover:bg-white/5`
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
										? `bg-white/10 ${colors.textAccent}`
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

					<div class="mt-2 grid gap-2">
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
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	/* Container-query responsive behavior (builder device preview friendly). */
	.tb-header3-desktop {
		display: none;
	}

	.tb-header3-contact {
		display: none;
	}

	@container (min-width: 1024px) {
		.tb-header3-desktop {
			display: flex;
		}

		.tb-header3-contact {
			display: flex;
		}

		.tb-header3-burger {
			display: none;
		}

		.tb-header3-mobile {
			display: none !important;
		}
	}
</style>
