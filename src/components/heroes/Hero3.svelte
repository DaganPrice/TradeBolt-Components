<script>
	export let website;
	export let pb;
	export let data = {};
	export let sections = [];
	export let embed = false;

	let formData = {
		name: '',
		phone: '',
		email: '',
		service: '',
		location: '',
		message: ''
	};

	let loading = false;
	let success = false;
	let error = '';

	function safeText(value, fallback = '') {
		if (value == null) return fallback;
		return String(value);
	}

	function getColorClasses(colorScheme = 'orange') {
		const colorMap = {
			orange: { text: 'text-orange-600', bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700' },
			red: { text: 'text-red-600', bg: 'bg-red-600', hoverBg: 'hover:bg-red-700' },
			blue: { text: 'text-blue-600', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700' },
			green: { text: 'text-green-600', bg: 'bg-green-600', hoverBg: 'hover:bg-green-700' },
			yellow: { text: 'text-yellow-600', bg: 'bg-yellow-600', hoverBg: 'hover:bg-yellow-700' },
			purple: { text: 'text-purple-600', bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700' },
			pink: { text: 'text-pink-600', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-700' },
			gray: { text: 'text-gray-600', bg: 'bg-gray-700', hoverBg: 'hover:bg-gray-800' }
		};
		return colorMap[colorScheme] || colorMap.orange;
	}

	function getBackgroundStyle(backgroundType, backgroundImage, overlayOpacity) {
		if (backgroundType === 'image' && backgroundImage) {
			try {
				const imageUrl =
					typeof backgroundImage === 'string'
						? backgroundImage
						: pb.files.getURL(
								{ id: backgroundImage.id, collectionId: 'images', collectionName: 'images' },
								backgroundImage.file
							);
				const opacity = (overlayOpacity || 55) / 100;
				return `background-image: linear-gradient(rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity})), url('${imageUrl}'); background-size: cover; background-position: center;`;
			} catch (err) {
				console.error('Error generating hero background image URL:', err);
				return '';
			}
		}
		return '';
	}

	$: colors = getColorClasses(website?.color_scheme);
	$: backgroundType = data?.background_type || 'image';
	$: backgroundStyle = getBackgroundStyle(backgroundType, data?.background_image, data?.overlay_opacity);
	$: heading = safeText(data?.heading, 'This is what your website could look like');
	$: contentHtml =
		safeText(data?.content) ||
		'Scroll down to see a fully-functioning demo. Every feature you see — services section, testimonials, contact forms — is exactly what we’ll build for your business.';

	$: badgeText = safeText(data?.badge_text, "You're viewing a demo website");

	$: phone = safeText(website?.contact_details?.phone, '').trim();
	$: contactHref = '/contact';
	$: callHref = phone ? `tel:${phone}` : '';

	$: chips = (Array.isArray(data?.chips)
		? data.chips
		: ['Fast turnaround', 'Hosting included', 'From £500']
	)
		.map((v) => safeText(v).trim())
		.filter(Boolean)
		.slice(0, 4);

	$: serviceOptions = (
		Array.isArray(data?.service_options)
			? data.service_options
			: ['New Website', 'Website Redesign', 'SEO & Local Rankings', 'Google Ads']
	)
		.map((v) => safeText(v).trim())
		.filter(Boolean)
		.slice(0, 12);

	const submitLabel = 'Submit enquiry';
	const formNote =
		'By submitting this form, you agree to be contacted about your enquiry. We typically respond within 1 business day.';

	function handleLinkClick(e) {
		if (embed) e.preventDefault();
	}

	function buildMessage() {
		const parts = [];
		const service = safeText(formData.service).trim();
		const location = safeText(formData.location).trim();
		const message = safeText(formData.message).trim();
		if (service) parts.push(`Service: ${service}`);
		if (location) parts.push(`Location: ${location}`);
		if (message) parts.push(message);
		return parts.join('\n');
	}

	async function handleSubmit(e) {
		e.preventDefault();
		error = '';
		success = false;

		if (embed) {
			success = true;
			setTimeout(() => (success = false), 1800);
			return;
		}

		loading = true;
		try {
			const payload = {
				website_id: website?.id,
				name: formData.name,
				email: formData.email,
				phone: formData.phone || '',
				message: buildMessage()
			};

			try {
				const resp = await fetch('/api/enquiries', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});

				const result = await resp.json().catch(() => ({}));
				if (!resp.ok) throw new Error(result?.error || 'Failed to submit enquiry');
			} catch (serverErr) {
				await pb.collection('enquiries').create({
					website_id: website.id,
					user_id: website.user_id,
					name: formData.name,
					email: formData.email,
					phone: formData.phone || '',
					message: payload.message,
					status: 'new'
				});
			}

			success = true;
			formData = { name: '', phone: '', email: '', service: '', location: '', message: '' };
			setTimeout(() => (success = false), 5000);
		} catch (err) {
			console.error('Error submitting enquiry:', err);
			error = 'Failed to send message. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<section
	class="relative min-h-screen bg-gray-900 text-white"
	style={backgroundStyle}
>
	<div class="container mx-auto px-4 py-20">
		<div class="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center">
			<div>
				{#if badgeText}
					<div
						class="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-900"
					>
						<span class="h-2 w-2 rounded-full {colors.bg}" aria-hidden="true"></span>
						<span>{badgeText}</span>
					</div>
				{/if}

				<h1 class="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
					{heading}
				</h1>

				{#if contentHtml}
					<p class="mt-5 max-w-prose text-lg text-white/85 tb-content-with-links">
						{@html contentHtml}
					</p>
				{/if}

				<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a
						href={contactHref}
						on:click={handleLinkClick}
						class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors {colors.bg} {colors.hoverBg}"
					>
						Contact us
					</a>

					{#if callHref}
						<a
							href={callHref}
							on:click={handleLinkClick}
							class="inline-flex items-center justify-center rounded-lg border border-white bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
						>
							Call us
						</a>
					{/if}
				</div>

				{#if chips.length}
					<div class="mt-7 flex flex-wrap gap-2">
						{#each chips as chip}
							<span
								class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900"
							>
								{chip}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				{#if success}
					<div class="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
						Thanks! Your message has been sent.
					</div>
				{/if}
				{#if error}
					<div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
						{error}
					</div>
				{/if}

				<form on:submit={handleSubmit} class="space-y-4">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="tb-hero3-name" class="mb-1 block text-sm font-medium text-gray-900">
								Name
							</label>
							<input
								id="tb-hero3-name"
								type="text"
								placeholder="John Smith"
								bind:value={formData.name}
								required
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
							/>
						</div>

						<div>
							<label for="tb-hero3-phone" class="mb-1 block text-sm font-medium text-gray-900">
								Phone
							</label>
							<input
								id="tb-hero3-phone"
								type="tel"
								placeholder="07xxx xxx xxx"
								bind:value={formData.phone}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
							/>
						</div>
					</div>

					<div>
						<label for="tb-hero3-email" class="mb-1 block text-sm font-medium text-gray-900">
							Email
						</label>
						<input
							id="tb-hero3-email"
							type="email"
							placeholder="you@company.co.uk"
							bind:value={formData.email}
							required
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
						/>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="tb-hero3-service" class="mb-1 block text-sm font-medium text-gray-900">
								Service
							</label>
							<select
								id="tb-hero3-service"
								bind:value={formData.service}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
							>
								<option value="">Select a service</option>
								{#each serviceOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="tb-hero3-location" class="mb-1 block text-sm font-medium text-gray-900">
								Location
							</label>
							<input
								id="tb-hero3-location"
								type="text"
								placeholder="Manchester"
								bind:value={formData.location}
								class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
							/>
						</div>
					</div>

					<div>
						<label for="tb-hero3-message" class="mb-1 block text-sm font-medium text-gray-900">
							Message
						</label>
						<textarea
							id="tb-hero3-message"
							rows="4"
							placeholder="Tell us what you need..."
							bind:value={formData.message}
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
						></textarea>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							class="inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 {colors.bg} {colors.hoverBg}"
						>
							{loading ? 'Sending…' : submitLabel}
						</button>
						<p class="mt-2 text-xs text-gray-500">{formNote}</p>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<style>
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
