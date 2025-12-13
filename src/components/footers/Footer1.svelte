<script>
	export let website;
	export let pb;
	export let data = {};

	const currentYear = new Date().getFullYear();

	function normalizeUrl(input) {
		const raw = (input || '').trim();
		if (!raw) return '';
		if (/^https?:\/\//i.test(raw)) return raw;
		if (/^www\./i.test(raw)) return `https://${raw}`;
		if (raw.includes('.') && !raw.includes(' ')) return `https://${raw}`;
		return raw;
	}

	function parseSocialLinks(value) {
		return (value || '')
			.split(/[\n,]+/g)
			.map((s) => s.trim())
			.filter(Boolean)
			.map((raw) => {
				const url = normalizeUrl(raw);
				const isLink = /^https?:\/\//i.test(url);
				const label = isLink
					? url
							.replace(/^https?:\/\//i, '')
							.replace(/^www\./i, '')
							.split(/[/?#]/)[0]
					: raw;
				return { raw, url: isLink ? url : '', label };
			});
	}

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				text: 'text-orange-500',
				hover: 'hover:text-orange-400',
				bg: 'bg-orange-600',
				hoverBg: 'hover:bg-orange-700'
			},
			red: {
				text: 'text-red-500',
				hover: 'hover:text-red-400',
				bg: 'bg-red-600',
				hoverBg: 'hover:bg-red-700'
			},
			blue: {
				text: 'text-blue-500',
				hover: 'hover:text-blue-400',
				bg: 'bg-blue-600',
				hoverBg: 'hover:bg-blue-700'
			},
			green: {
				text: 'text-green-500',
				hover: 'hover:text-green-400',
				bg: 'bg-green-600',
				hoverBg: 'hover:bg-green-700'
			},
			yellow: {
				text: 'text-yellow-500',
				hover: 'hover:text-yellow-400',
				bg: 'bg-yellow-600',
				hoverBg: 'hover:bg-yellow-700'
			},
			purple: {
				text: 'text-purple-500',
				hover: 'hover:text-purple-400',
				bg: 'bg-purple-600',
				hoverBg: 'hover:bg-purple-700'
			},
			pink: {
				text: 'text-pink-500',
				hover: 'hover:text-pink-400',
				bg: 'bg-pink-600',
				hoverBg: 'hover:bg-pink-700'
			},
			gray: {
				text: 'text-gray-500',
				hover: 'hover:text-gray-400',
				bg: 'bg-gray-600',
				hoverBg: 'hover:bg-gray-700'
			}
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
	$: showTradeboltBadge = data.show_tradebolt_badge !== false;
	$: copyrightText =
		data.copyright_text || `© ${currentYear} ${website.business_name}. All rights reserved.`;
	$: businessHours = data.business_hours || [];
	$: socialLinks = parseSocialLinks(website?.contact_details?.social_media);
	$: websiteUrl = normalizeUrl(website?.contact_details?.website);
	$: aboutText = (website?.about_business || '').trim();

	function scrollToSection(id) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<footer class="border-t border-white/5 bg-gray-950 text-gray-300">
	<!-- Main Footer Content -->
	<div class="tb-footer-pad mx-auto max-w-7xl px-4 py-12">
		<div class="tb-footer-grid grid gap-10">
			<!-- Column 1: Company Info -->
			<div class="space-y-4">
				<h3 class="text-xl font-bold tracking-tight text-white">{website.business_name}</h3>

				{#if aboutText}
					<p class="tb-footer-about text-sm leading-relaxed whitespace-pre-line text-gray-400">
						{aboutText}
					</p>
				{/if}

				{#if socialLinks.length > 0}
					<div class="pt-1">
						<p class="mb-2 text-sm font-semibold text-white">Social</p>
						<div class="flex flex-wrap gap-2">
							{#each socialLinks as item}
								{#if item.url}
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10 {colors.hover}"
									>
										{item.label}
									</a>
								{:else}
									<span
										class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400"
									>
										{item.label}
									</span>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Column 2: Quick Links -->
			<div>
				<h3 class="mb-4 text-sm font-semibold tracking-wide text-white uppercase">Quick Links</h3>
				<ul class="space-y-2 text-sm">
					<li>
						<a
							href="#hero"
							on:click|preventDefault={() => scrollToSection('hero')}
							class="text-sm {colors.hover} inline-block transition-colors hover:translate-x-1"
						>
							Home
						</a>
					</li>
					<li>
						<a
							href="#about"
							on:click|preventDefault={() => scrollToSection('about')}
							class="text-sm {colors.hover} inline-block transition-colors hover:translate-x-1"
						>
							About Us
						</a>
					</li>
					{#if website.services_offered && website.services_offered.length > 0}
						<li>
							<a
								href="#services"
								on:click|preventDefault={() => scrollToSection('services')}
								class="text-sm {colors.hover} inline-block transition-colors hover:translate-x-1"
							>
								Services
							</a>
						</li>
					{/if}
					{#if website.locations_covered && website.locations_covered.length > 0}
						<li>
							<a
								href="#locations"
								on:click|preventDefault={() => scrollToSection('locations')}
								class="text-sm {colors.hover} inline-block transition-colors hover:translate-x-1"
							>
								Areas Covered
							</a>
						</li>
					{/if}
					<li>
						<a
							href="#contact"
							on:click|preventDefault={() => scrollToSection('contact')}
							class="text-sm {colors.hover} inline-block transition-colors hover:translate-x-1"
						>
							Contact
						</a>
					</li>
				</ul>
			</div>

			<!-- Column 3: Contact Info -->
			<div>
				<h3 class="mb-4 text-sm font-semibold tracking-wide text-white uppercase">Contact</h3>
				<ul class="space-y-3">
					{#if website.contact_details?.phone}
						<li class="flex items-start space-x-3">
							<svg
								class="h-5 w-5 {colors.text} mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<a
								href="tel:{website.contact_details.phone}"
								class="text-sm {colors.hover} transition-colors"
							>
								{website.contact_details.phone}
							</a>
						</li>
					{/if}
					{#if website.contact_details?.email}
						<li class="flex items-start space-x-3">
							<svg
								class="h-5 w-5 {colors.text} mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<a
								href="mailto:{website.contact_details.email}"
								class="text-sm {colors.hover} break-all transition-colors"
							>
								{website.contact_details.email}
							</a>
						</li>
					{/if}
					{#if websiteUrl}
						<li class="flex items-start space-x-3">
							<svg
								class="h-5 w-5 {colors.text} mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.6 9h16.8M3.6 15h16.8"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3a15 15 0 010 18"
								/>
							</svg>
							<a
								href={websiteUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm {colors.hover} break-all transition-colors"
							>
								{website.contact_details.website}
							</a>
						</li>
					{/if}
					{#if website.contact_details?.address}
						<li class="flex items-start space-x-3">
							<svg
								class="h-5 w-5 {colors.text} mt-0.5 flex-shrink-0"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span class="text-sm whitespace-pre-line">
								{website.contact_details.address}
							</span>
						</li>
					{/if}
				</ul>

				<!-- Business Hours (if provided) -->
				{#if businessHours.length > 0}
					<div class="mt-6">
						<h4 class="mb-2 text-sm font-semibold text-white">Opening Hours</h4>
						<ul class="space-y-1">
							{#each businessHours as hours}
								<li class="grid grid-cols-1 gap-x-3 text-xs sm:grid-cols-[minmax(0,1fr)_auto]">
									<span class="min-w-0">{hours.day}</span>
									<span class="min-w-0 text-gray-400 sm:text-right">{hours.time}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Column 4: Services -->
			{#if website.services_offered && website.services_offered.length > 0}
				<div>
					<h3 class="mb-4 text-sm font-semibold tracking-wide text-white uppercase">Services</h3>
					<ul class="space-y-2">
						{#each website.services_offered.slice(0, 6) as service}
							<li class="flex items-start space-x-2">
								<svg
									class="h-4 w-4 {colors.text} mt-0.5 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span class="text-sm text-gray-300">{service}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>

	<!-- Bottom Bar -->
	<div class="border-t border-white/10 bg-black/20">
		<div class="mx-auto max-w-7xl px-4 py-6">
			<div class="tb-footer-bottom flex flex-col items-center justify-between space-y-4">
				<!-- Copyright -->
				<div class="tb-footer-copyright text-center text-sm leading-relaxed text-gray-400">
					{copyrightText}
				</div>

				<!-- Legal Links -->
				<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
					<a href="#privacy" class="text-gray-400 {colors.hover} transition-colors">Privacy</a>
					<a href="#terms" class="text-gray-400 {colors.hover} transition-colors">Terms</a>
					{#if showTradeboltBadge}
						<a
							href="https://tradebolt.co.uk"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-400 {colors.hover} flex items-center space-x-1 transition-colors"
						>
							<span>Powered by</span>
							<span class="{colors.text} font-semibold">TradeBolt</span>
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.tb-footer-grid {
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.tb-footer-about {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@container (min-width: 768px) {
		.tb-footer-bottom {
			flex-direction: row;
		}

		.tb-footer-bottom {
			row-gap: 0;
		}

		.tb-footer-copyright {
			text-align: left;
		}
	}

	@container (min-width: 1024px) {
		.tb-footer-pad {
			padding-top: 4rem;
			padding-bottom: 4rem;
		}

		.tb-footer-grid {
			gap: 3rem;
		}
	}
</style>
