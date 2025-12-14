<script>
	export let website;
	export let data;

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { bg: 'bg-orange-500', hoverBg: 'hover:bg-orange-600' },
			red: { bg: 'bg-red-500', hoverBg: 'hover:bg-red-600' },
			blue: { bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600' },
			green: { bg: 'bg-green-500', hoverBg: 'hover:bg-green-600' },
			yellow: { bg: 'bg-yellow-500', hoverBg: 'hover:bg-yellow-600' },
			purple: { bg: 'bg-purple-500', hoverBg: 'hover:bg-purple-600' },
			pink: { bg: 'bg-pink-500', hoverBg: 'hover:bg-pink-600' },
			gray: { bg: 'bg-gray-500', hoverBg: 'hover:bg-gray-600' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	$: colors = getColorClasses(website.color_scheme);

	// Combine sitewide contact details with additional ones
	$: phones = (() => {
		const phoneList = [];
		// Add sitewide phone from website.contact_details
		if (website?.contact_details?.phone) {
			phoneList.push(website.contact_details.phone);
		}
		// Add additional phones from data
		if (data?.additional_phones && Array.isArray(data.additional_phones)) {
			phoneList.push(...data.additional_phones.filter(p => p));
		}
		// Fallback: if no sitewide phone, use data.phone for backward compatibility
		if (phoneList.length === 0 && data?.phone) {
			phoneList.push(data.phone);
		}
		return phoneList;
	})();

	$: emails = (() => {
		const emailList = [];
		// Add sitewide email from website.contact_details
		if (website?.contact_details?.email) {
			emailList.push(website.contact_details.email);
		}
		// Add additional emails from data
		if (data?.additional_emails && Array.isArray(data.additional_emails)) {
			emailList.push(...data.additional_emails.filter(e => e));
		}
		// Fallback: if no sitewide email, use data.email for backward compatibility
		if (emailList.length === 0 && data?.email) {
			emailList.push(data.email);
		}
		return emailList;
	})();

	// Use sitewide address or fallback to data.address
	$: address = website?.contact_details?.address || data?.address;
	$: websiteUrl = website?.contact_details?.website || data?.website;
	$: socialMedia = website?.contact_details?.social_media || data?.social_media;

	// Primary contact for CTA button
	$: primaryPhone = phones[0];
	$: primaryEmail = emails[0];
</script>

<section id="contact" class="py-20 bg-gray-900 text-white">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-4xl font-bold mb-12 text-center">{data.heading || 'Get In Touch'}</h2>

			<div class="tb-contact-grid grid grid-cols-1 gap-8">
				<!-- Contact Information -->
				<div class="space-y-6">
					<h3 class="text-2xl font-semibold mb-6">Contact Information</h3>

					{#if phones.length > 0}
						{#each phones as phone, i}
							<a href="tel:{phone}" class="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
								<div class="flex-shrink-0">
									<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
										<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
								</div>
								<div>
									<p class="text-sm text-gray-400">Phone{#if phones.length > 1} {i + 1}{/if}</p>
									<p class="text-lg font-semibold">{phone}</p>
								</div>
							</a>
						{/each}
					{/if}

					{#if emails.length > 0}
						{#each emails as email, i}
							<a href="mailto:{email}" class="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
								<div class="flex-shrink-0">
									<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
										<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
								</div>
								<div>
									<p class="text-sm text-gray-400">Email{#if emails.length > 1} {i + 1}{/if}</p>
									<p class="text-lg font-semibold">{email}</p>
								</div>
							</a>
						{/each}
					{/if}

					{#if address}
						<div class="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
									<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</div>
							</div>
							<div>
								<p class="text-sm text-gray-400">Address</p>
								<p class="text-lg font-semibold whitespace-pre-wrap">{address}</p>
							</div>
						</div>
					{/if}

					{#if websiteUrl}
						<a href={websiteUrl} target="_blank" rel="noopener noreferrer" class="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
									<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
									</svg>
								</div>
							</div>
							<div>
								<p class="text-sm text-gray-400">Website</p>
								<p class="text-lg font-semibold break-all">{websiteUrl}</p>
							</div>
						</a>
					{/if}

					{#if socialMedia}
						<div class="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
							<div class="flex-shrink-0">
								<div class="w-12 h-12 {colors.bg} rounded-lg flex items-center justify-center">
									<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
									</svg>
								</div>
							</div>
							<div>
								<p class="text-sm text-gray-400">Social Media</p>
								<p class="text-lg font-semibold">{socialMedia}</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Call to Action -->
				<div class="flex items-center justify-center">
					<div class="text-center space-y-6">
						<div class="w-24 h-24 {colors.bg} rounded-full flex items-center justify-center mx-auto mb-6">
							<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
							</svg>
						</div>
						<h3 class="text-2xl font-bold">Ready to get started?</h3>
						<p class="text-gray-400 text-lg">Get in touch with us today and let's discuss your project.</p>
						{#if primaryPhone}
							<a
								href="tel:{primaryPhone}"
								class="inline-block px-8 py-4 {colors.bg} {colors.hoverBg} text-white font-bold rounded-lg transition-colors"
							>
								Call Us Now
							</a>
						{:else if primaryEmail}
							<a
								href="mailto:{primaryEmail}"
								class="inline-block px-8 py-4 {colors.bg} {colors.hoverBg} text-white font-bold rounded-lg transition-colors"
							>
								Email Us
							</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@container (min-width: 768px) {
		.tb-contact-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
