<script>
	export let website;
	export let pb;
	export let data = {};

	const currentYear = new Date().getFullYear();

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { text: 'text-orange-500', hover: 'hover:text-orange-400', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700' },
			red: { text: 'text-red-500', hover: 'hover:text-red-400', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700' },
			blue: { text: 'text-blue-500', hover: 'hover:text-blue-400', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700' },
			green: { text: 'text-green-500', hover: 'hover:text-green-400', bg: 'bg-green-600', hoverBg: 'hover:bg-green-700' },
			yellow: { text: 'text-yellow-500', hover: 'hover:text-yellow-400', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700' },
			purple: { text: 'text-purple-500', hover: 'hover:text-purple-400', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700' },
			pink: { text: 'text-pink-500', hover: 'hover:text-pink-400', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700' },
			gray: { text: 'text-gray-500', hover: 'hover:text-gray-400', bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-700' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);
	$: showTradeboltBadge = data.show_tradebolt_badge !== false;
	$: copyrightText = data.copyright_text || `© ${currentYear} ${website.business_name}. All rights reserved.`;
	$: businessHours = data.business_hours || [];

	function scrollToSection(id) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<footer class="bg-gray-950 text-gray-300">
	<!-- Main Footer Content -->
	<div class="tb-footer-pad container mx-auto px-4 py-12">
		<div class="tb-footer-grid grid grid-cols-1 gap-8">

			<!-- Column 1: Company Info -->
			<div class="space-y-4">
				<h3 class="text-white text-lg font-bold mb-4">{website.business_name}</h3>

				<!-- Social Media Links (if available) -->
				{#if website.contact_details?.social_media}
					<div class="pt-4">
						<p class="text-sm font-semibold text-white mb-2">Follow Us</p>
						<div class="flex items-center space-x-3">
							<!-- Facebook -->
							<a href="#" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center {colors.hover} transition-colors">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</a>
							<!-- Instagram -->
							<a href="#" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center {colors.hover} transition-colors">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
								</svg>
							</a>
							<!-- Twitter/X -->
							<a href="#" class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center {colors.hover} transition-colors">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
								</svg>
							</a>
						</div>
					</div>
				{/if}
			</div>

			<!-- Column 2: Quick Links -->
			<div>
				<h3 class="text-white text-lg font-bold mb-4">Quick Links</h3>
				<ul class="space-y-2">
					<li>
						<a href="#hero" on:click|preventDefault={() => scrollToSection('hero')} class="text-sm {colors.hover} transition-colors hover:translate-x-1 inline-block">
							Home
						</a>
					</li>
					<li>
						<a href="#about" on:click|preventDefault={() => scrollToSection('about')} class="text-sm {colors.hover} transition-colors hover:translate-x-1 inline-block">
							About Us
						</a>
					</li>
					{#if website.services_offered && website.services_offered.length > 0}
						<li>
							<a href="#services" on:click|preventDefault={() => scrollToSection('services')} class="text-sm {colors.hover} transition-colors hover:translate-x-1 inline-block">
								Services
							</a>
						</li>
					{/if}
					{#if website.locations_covered && website.locations_covered.length > 0}
						<li>
							<a href="#locations" on:click|preventDefault={() => scrollToSection('locations')} class="text-sm {colors.hover} transition-colors hover:translate-x-1 inline-block">
								Areas Covered
							</a>
						</li>
					{/if}
					<li>
						<a href="#contact" on:click|preventDefault={() => scrollToSection('contact')} class="text-sm {colors.hover} transition-colors hover:translate-x-1 inline-block">
							Contact
						</a>
					</li>
				</ul>
			</div>

			<!-- Column 3: Contact Info -->
			<div>
				<h3 class="text-white text-lg font-bold mb-4">Contact Us</h3>
				<ul class="space-y-3">
					{#if website.contact_details?.phone}
						<li class="flex items-start space-x-3">
							<svg class="w-5 h-5 {colors.text} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
							<a href="tel:{website.contact_details.phone}" class="text-sm {colors.hover} transition-colors">
								{website.contact_details.phone}
							</a>
						</li>
					{/if}
					{#if website.contact_details?.email}
						<li class="flex items-start space-x-3">
							<svg class="w-5 h-5 {colors.text} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							<a href="mailto:{website.contact_details.email}" class="text-sm {colors.hover} transition-colors break-all">
								{website.contact_details.email}
							</a>
						</li>
					{/if}
					{#if website.contact_details?.address}
						<li class="flex items-start space-x-3">
							<svg class="w-5 h-5 {colors.text} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
						<h4 class="text-white text-sm font-semibold mb-2">Opening Hours</h4>
						<ul class="space-y-1">
							{#each businessHours as hours}
								<li class="text-xs flex justify-between">
									<span>{hours.day}</span>
									<span class="text-gray-400">{hours.time}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Column 4: Services -->
			<div>
				{#if website.services_offered && website.services_offered.length > 0}
					<h3 class="text-white text-lg font-bold mb-4">Our Services</h3>
					<ul class="space-y-2">
						{#each website.services_offered.slice(0, 6) as service}
							<li class="flex items-start space-x-2">
								<svg class="w-4 h-4 {colors.text} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								<span class="text-sm">{service}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

		</div>
	</div>

	<!-- Bottom Bar -->
	<div class="border-t border-gray-800">
		<div class="container mx-auto px-4 py-6">
			<div class="tb-footer-bottom flex flex-col justify-between items-center space-y-4">
				<!-- Copyright -->
				<div class="tb-footer-copyright text-sm text-gray-400 text-center">
					{copyrightText}
				</div>

				<!-- Legal Links -->
				<div class="flex items-center space-x-6 text-sm">
					<a href="#privacy" class="text-gray-400 {colors.hover} transition-colors">Privacy Policy</a>
					<a href="#terms" class="text-gray-400 {colors.hover} transition-colors">Terms of Service</a>
					{#if showTradeboltBadge}
						<a href="https://tradebolt.co.uk" target="_blank" rel="noopener noreferrer" class="text-gray-400 {colors.hover} transition-colors flex items-center space-x-1">
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
	@container (min-width: 768px) {
		.tb-footer-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

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
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.tb-footer-grid {
			gap: 3rem;
		}
	}
</style>
