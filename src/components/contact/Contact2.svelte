<script>
	export let website;
	export let data;
	export let pb;

	let formData = {
		name: '',
		email: '',
		phone: '',
		message: ''
	};

	let loading = false;
	let success = false;
	let error = '';

	// Get color scheme classes based on the selected color
	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: {
				bg: 'bg-orange-500',
				hoverBg: 'hover:bg-orange-600',
				focus: 'focus:border-orange-500 focus:ring-orange-500',
				text: 'text-orange-500'
			},
			red: {
				bg: 'bg-red-500',
				hoverBg: 'hover:bg-red-600',
				focus: 'focus:border-red-500 focus:ring-red-500',
				text: 'text-red-500'
			},
			blue: {
				bg: 'bg-blue-500',
				hoverBg: 'hover:bg-blue-600',
				focus: 'focus:border-blue-500 focus:ring-blue-500',
				text: 'text-blue-500'
			},
			green: {
				bg: 'bg-green-500',
				hoverBg: 'hover:bg-green-600',
				focus: 'focus:border-green-500 focus:ring-green-500',
				text: 'text-green-500'
			},
			yellow: {
				bg: 'bg-yellow-500',
				hoverBg: 'hover:bg-yellow-600',
				focus: 'focus:border-yellow-500 focus:ring-yellow-500',
				text: 'text-yellow-500'
			},
			purple: {
				bg: 'bg-purple-500',
				hoverBg: 'hover:bg-purple-600',
				focus: 'focus:border-purple-500 focus:ring-purple-500',
				text: 'text-purple-500'
			},
			pink: {
				bg: 'bg-pink-500',
				hoverBg: 'hover:bg-pink-600',
				focus: 'focus:border-pink-500 focus:ring-pink-500',
				text: 'text-pink-500'
			},
			gray: {
				bg: 'bg-gray-500',
				hoverBg: 'hover:bg-gray-600',
				focus: 'focus:border-gray-500 focus:ring-gray-500',
				text: 'text-gray-500'
			}
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

	async function handleSubmit(e) {
		e.preventDefault();
		loading = true;
		error = '';
		success = false;

		try {
			await pb.collection('enquiries').create({
				website_id: website.id,
				user_id: website.user_id,
				name: formData.name,
				email: formData.email,
				phone: formData.phone || '',
				message: formData.message,
				status: 'new'
			});

			success = true;
			formData = { name: '', email: '', phone: '', message: '' };

			// Clear success message after 5 seconds
			setTimeout(() => {
				success = false;
			}, 5000);
		} catch (err) {
			console.error('Error submitting enquiry:', err);
			error = 'Failed to send message. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<section id="contact" class="py-20 bg-gray-900 text-white">
	<div class="container mx-auto px-4">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-4xl font-bold mb-12 text-center">{data.heading || 'Contact Us'}</h2>

			{#if data.description}
				<p class="text-center text-gray-400 text-lg mb-12 tb-content-with-links">{@html data.description}</p>
			{/if}

			<div class="tb-contact2-grid grid grid-cols-1 gap-12">
				<!-- Left: Contact Information -->
				<div class="space-y-6">
					{#if data.contactInfoHeading}
						<h3 class="text-2xl font-semibold mb-6">{data.contactInfoHeading}</h3>
					{:else}
						<h3 class="text-2xl font-semibold mb-6">Get In Touch</h3>
					{/if}

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

					{#if phones.length === 0 && emails.length === 0 && !address}
						<div class="text-center py-8">
							<div class="w-24 h-24 {colors.bg} rounded-full flex items-center justify-center mx-auto mb-6">
								<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
								</svg>
							</div>
							<h3 class="text-2xl font-bold mb-4">Let's Talk</h3>
							<p class="text-gray-400 text-lg">Fill out the form and we'll get back to you as soon as possible.</p>
						</div>
					{/if}
				</div>

				<!-- Right: Contact Form -->
				<div>
					{#if success}
						<div class="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg">
							<div class="flex items-start">
								<svg class="h-5 w-5 text-green-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								<p class="text-green-400 font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
							</div>
						</div>
					{/if}

					{#if error}
						<div class="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
							<div class="flex items-start">
								<svg class="h-5 w-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
								<p class="text-red-400 font-medium">{error}</p>
							</div>
						</div>
					{/if}

					<form on:submit={handleSubmit} class="space-y-6">
						<!-- Name Field -->
						<div>
							<label for="name" class="block text-sm font-semibold mb-2">Name *</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none {colors.focus} focus:ring-2 focus:ring-opacity-20 transition-colors text-white"
								placeholder="Your name"
							/>
						</div>

						<!-- Email Field -->
						<div>
							<label for="email" class="block text-sm font-semibold mb-2">Email *</label>
							<input
								type="email"
								id="email"
								name="email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none {colors.focus} focus:ring-2 focus:ring-opacity-20 transition-colors text-white"
								placeholder="your@email.com"
							/>
						</div>

						<!-- Phone Field -->
						<div>
							<label for="phone" class="block text-sm font-semibold mb-2">Phone</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								bind:value={formData.phone}
								class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none {colors.focus} focus:ring-2 focus:ring-opacity-20 transition-colors text-white"
								placeholder="Your phone number"
							/>
						</div>

						<!-- Message Field -->
						<div>
							<label for="message" class="block text-sm font-semibold mb-2">Message *</label>
							<textarea
								id="message"
								name="message"
								bind:value={formData.message}
								required
								rows="5"
								class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none {colors.focus} focus:ring-2 focus:ring-opacity-20 transition-colors text-white resize-none"
								placeholder="Tell us about your enquiry..."
							></textarea>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={loading}
							class="w-full px-8 py-4 {colors.bg} {colors.hoverBg} text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{#if loading}
								<svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							{:else}
								Send Message
							{/if}
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@container (min-width: 768px) {
		.tb-contact2-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	:global(.tb-content-with-links a) {
		color: currentColor;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: opacity 0.2s;
	}

	:global(.tb-content-with-links a:hover) {
		opacity: 0.7;
	}
</style>
