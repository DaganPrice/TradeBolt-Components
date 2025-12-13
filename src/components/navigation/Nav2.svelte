<script>
	export let website;
	export let pb;
	export let pages = [];
	export let currentPage = null;
	export let sections = [];
	export let data = {};

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

	// Get visible pages for navigation
	$: navPages = getOrderedNavPages(pages, data?.page_nav_order);

	// Determine if this is a multi-page site
	$: isMultiPage = navPages.length > 0;

	// Get unique section types on the current page for jump links
	$: allSectionTypes = [...new Set(sections.filter((s) => s.is_visible).map((s) => s.section_type))];

	// Apply custom order if specified in header data
	$: sectionTypes = (() => {
		const navOrder = data?.nav_order;
		if (navOrder && Array.isArray(navOrder) && navOrder.length > 0) {
			return navOrder.filter((type) => allSectionTypes.includes(type));
		}
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
</script>

<header class="tb-header-2 fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white">
	<!-- Top Bar -->
	<div class="bg-gray-950 border-b border-gray-800">
		<div class="container mx-auto px-4 md:px-8">
			<div class="tb-top-bar-content flex flex-col md:flex-row md:justify-between md:items-center py-3 gap-3 md:gap-0">
				<!-- Logo Section -->
				<a
					href={isMultiPage ? '/' : '#hero'}
					on:click={isMultiPage
						? null
						: (e) => {
								e.preventDefault();
								scrollToSection('hero');
							}}
					class="flex items-center gap-4"
				>
					{#if logoUrl}
						<img src={logoUrl} alt="{website.business_name} logo" class="h-12 w-auto" />
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
					<div class="tb-contact-info text-center md:text-right">
						<a href="tel:{phoneNumber}" class="flex items-center justify-center md:justify-end gap-2 text-xl md:text-2xl font-bold {colors.hoverTextAccent} transition-colors">
							<i class="fas fa-phone text-base"></i>
							{phoneNumber}
						</a>
						{#if businessHours}
							<div class="{colors.textAccent} text-xs md:text-sm mt-1">
								{businessHours}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Navigation Bar -->
	<div class="bg-gray-900">
		<div class="container mx-auto px-4 md:px-8">
			<div class="tb-nav-content flex flex-col md:flex-row md:justify-between md:items-center py-0 gap-3 md:gap-0">
				<!-- Desktop Navigation -->
				<nav class="tb-desktop-nav">
					<ul class="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 py-3 md:py-0">
						{#if isMultiPage}
							<!-- Multi-page navigation -->
							<li>
								<a
									href="/"
									class="block py-4 text-sm font-medium transition-colors {currentPage?.is_home ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
								>
									Home
								</a>
							</li>
							{#each navPages as page}
								<li>
									<a
										href="/{page.slug}"
										class="block py-4 text-sm font-medium transition-colors {currentPage && currentPage.id === page.id ? colors.textAccent : `text-white ${colors.hoverTextAccent}`}"
									>
										{page.title}
									</a>
								</li>
							{/each}
						{:else}
							<!-- Single-page navigation: Jump links -->
							{#each sectionTypes as sectionType}
								{#if sectionType !== 'header' && sectionType !== 'hero' && sectionType !== 'footer'}
									<li>
										<a
											href="#{sectionType}"
											on:click|preventDefault={() => scrollToSection(sectionType)}
											class="block py-4 text-sm font-medium text-white {colors.hoverTextAccent} transition-colors"
										>
											{sectionType === 'contact' ? contactCtaLabel : getSectionLabel(sectionType)}
										</a>
									</li>
								{/if}
							{/each}
						{/if}
					</ul>
				</nav>

				<!-- Right Section: Social + CTA -->
				<div class="tb-nav-right flex items-center justify-center md:justify-end gap-6 py-3 md:py-0">
					<!-- Social Icons (if provided in website data) -->
					{#if website?.contact_details?.social_media}
						<div class="flex gap-4">
							{#each website.contact_details.social_media.split(',') as social}
								<a href={social.trim()} target="_blank" rel="noopener" class="text-white {colors.hoverTextAccent} transition-colors text-base">
									<i class="fab fa-{social.toLowerCase().includes('facebook') ? 'facebook-f' : social.toLowerCase().includes('instagram') ? 'instagram' : social.toLowerCase().includes('twitter') ? 'twitter' : social.toLowerCase().includes('linkedin') ? 'linkedin-in' : 'link'}"></i>
								</a>
							{/each}
						</div>
					{/if}

					<!-- CTA Button -->
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
			</div>
		</div>
	</div>
</header>

<!-- Spacer to prevent content from going under fixed header -->
<div class="tb-header-2-spacer" style="height: 140px;"></div>

<style>
	/* Responsive adjustments using container queries */
	@container (max-width: 768px) {
		.tb-top-bar-content {
			flex-direction: column;
			text-align: center;
		}

		.tb-contact-info {
			text-align: center !important;
		}

		.tb-nav-content {
			flex-direction: column;
		}

		.tb-desktop-nav ul {
			justify-content: center;
		}
	}

	.tb-cta-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
	}
</style>
