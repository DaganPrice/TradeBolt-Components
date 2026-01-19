<script>
	export let website;
	export let pb;
	export let data = {};
	export let sections = [];
	export let embed = false;

	const DEFAULT_BACKGROUND_URL =
		'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&w=2200&q=80';

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

	function getPrimaryColor(colorScheme = 'orange') {
		const map = {
			orange: '#ff7a00',
			red: '#ef4444',
			blue: '#3b82f6',
			green: '#22c55e',
			yellow: '#eab308',
			purple: '#a855f7',
			pink: '#ec4899',
			gray: '#6b7280'
		};
		return map[colorScheme] || map.orange;
	}

	function getBackgroundUrl(backgroundType, backgroundImage, backgroundImageUrl) {
		if (backgroundType === 'image') {
			if (typeof backgroundImageUrl === 'string' && backgroundImageUrl.trim()) {
				return backgroundImageUrl.trim();
			}

			if (typeof backgroundImage === 'string' && backgroundImage.trim()) {
				return backgroundImage.trim();
			}

			if (backgroundImage?.id && backgroundImage?.file && pb?.files?.getURL) {
				try {
					return pb.files.getURL(
						{ id: backgroundImage.id, collectionId: 'images', collectionName: 'images' },
						backgroundImage.file
					);
				} catch (err) {
					console.error('Error generating hero background URL:', err);
				}
			}

			return DEFAULT_BACKGROUND_URL;
		}

		return '';
	}

	$: backgroundType = data?.background_type || 'image';
	$: backgroundUrl = getBackgroundUrl(backgroundType, data?.background_image, data?.background_image_url);
	$: overlayOpacity = Number.isFinite(Number(data?.overlay_opacity)) ? Number(data.overlay_opacity) : 55;
	$: overlayAlpha = Math.min(0.9, Math.max(0.25, overlayOpacity / 100));

	$: primaryColor =
		safeText(data?.primary_color || website?.primary_color, '').trim() ||
		getPrimaryColor(website?.color_scheme);

	$: badgeText = safeText(data?.badge_text, "You're Viewing a Demo Website");
	$: headingHtml =
		safeText(data?.heading) ||
		'This Is What <span class="accent">Your</span><br/>Roofing Website<br/>Could Look Like';

	$: contentHtml =
		safeText(data?.content) ||
		'Scroll down to see a fully-functioning demo. Every feature you see — services section, testimonials, contact forms — is exactly what we’ll build for your business.';

	$: primaryCtaLabel = safeText(data?.primary_cta_label, 'Contact us →');
	$: primaryCtaHref = safeText(data?.primary_cta_href, '#tb-hero3-form');

	$: phone = safeText(website?.contact_details?.phone, '');
	$: secondaryCtaLabel = safeText(data?.secondary_cta_label, phone ? 'Call us' : '');
	$: secondaryCtaHref = safeText(data?.secondary_cta_href, phone ? `tel:${phone}` : '#tb-hero3-form');

	$: chips = (Array.isArray(data?.chips) ? data.chips : ['24hr Delivery', 'Hosting Included', 'From £500'])
		.map((v) => safeText(v).trim())
		.filter(Boolean)
		.slice(0, 3);

	$: formHeading = safeText(data?.form_heading, 'Get Your Website Started');
	$: submitLabel = safeText(data?.form_submit_label, 'Submit Enquiry →');
	$: formNote = safeText(
		data?.form_note,
		'By submitting this form, you agree to be contacted about your enquiry. We typically respond within 1 business day.'
	);

	$: serviceOptions = (
		Array.isArray(data?.service_options)
			? data.service_options
			: ['New Website', 'Website Redesign', 'SEO & Local Rankings', 'Google Ads']
	)
		.map((v) => safeText(v).trim())
		.filter(Boolean)
		.slice(0, 12);

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

<section class="hero" style={`--primary:${primaryColor}; --overlayAlpha:${overlayAlpha};`}>
	{#if backgroundUrl}
		<div class="bg" style={`background-image:url("${backgroundUrl}");`}></div>
	{/if}
	<div class="overlay"></div>
	<div class="grain"></div>

	<div class="wrap">
		<div class="left">
			<div class="badge">
				<span class="dot"></span>
				<span>{badgeText}</span>
			</div>

			<h1>{@html headingHtml}</h1>

			<p class="tb-content-with-links">
				{@html contentHtml}
			</p>

			<div class="ctaRow">
				<a class="btn btnPrimary" href={primaryCtaHref} on:click={handleLinkClick}>
					{primaryCtaLabel}
				</a>
				{#if secondaryCtaLabel}
					<a class="btn btnGhost" href={secondaryCtaHref} on:click={handleLinkClick}>
						{secondaryCtaLabel}
					</a>
				{/if}
			</div>

			{#if chips.length}
				<div class="chips" aria-label="Key benefits">
					{#each chips as chip, idx}
						<div class="chip">
							{#if idx === 0}
								<svg viewBox="0 0 24 24" fill="none">
									<path
										d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"
										stroke="currentColor"
										stroke-width="2"
									/>
									<path
										d="M12 6v6l4 2"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							{:else if idx === 1}
								<svg viewBox="0 0 24 24" fill="none">
									<path
										d="M12 2l8 4v6c0 5-3.5 9.4-8 10-4.5-.6-8-5-8-10V6l8-4Z"
										stroke="currentColor"
										stroke-width="2"
									/>
									<path
										d="M9 12l2 2 4-5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							{:else}
								<svg viewBox="0 0 24 24" fill="none">
									<path
										d="M12 1v22"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
									<path
										d="M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
									/>
								</svg>
							{/if}
							{chip}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="panel" id="tb-hero3-form">
			<div class="panelInner">
				<div class="panelHeader">
					<div class="spark">✦</div>
					<h3>{formHeading}</h3>
				</div>

				<div class="formCard">
					{#if success}
						<div class="alert alertSuccess">
							<strong>Thanks!</strong> Your message has been sent.
						</div>
					{/if}
					{#if error}
						<div class="alert alertError">{error}</div>
					{/if}

					<form on:submit={handleSubmit}>
						<div class="formGrid">
							<div class="field">
								<label for="tb-hero3-name">Name</label>
								<input
									id="tb-hero3-name"
									name="name"
									type="text"
									placeholder="John Smith"
									bind:value={formData.name}
									required
								/>
							</div>

							<div class="field">
								<label for="tb-hero3-phone">Phone</label>
								<input
									id="tb-hero3-phone"
									name="phone"
									type="tel"
									placeholder="07xxx xxx xxx"
									bind:value={formData.phone}
								/>
							</div>

							<div class="field span2">
								<label for="tb-hero3-email">Email</label>
								<input
									id="tb-hero3-email"
									name="email"
									type="email"
									placeholder="you@company.co.uk"
									bind:value={formData.email}
									required
								/>
							</div>

							<div class="field">
								<label for="tb-hero3-service">Service</label>
								<select id="tb-hero3-service" name="service" bind:value={formData.service}>
									<option value="">Select a service</option>
									{#each serviceOptions as option}
										<option value={option}>{option}</option>
									{/each}
								</select>
							</div>

							<div class="field">
								<label for="tb-hero3-location">Location</label>
								<input
									id="tb-hero3-location"
									name="location"
									type="text"
									placeholder="Manchester"
									bind:value={formData.location}
								/>
							</div>

							<div class="field span2">
								<label for="tb-hero3-message">Message</label>
								<textarea
									id="tb-hero3-message"
									name="message"
									rows="4"
									placeholder="Tell us what you need..."
									bind:value={formData.message}
								></textarea>
							</div>

							<div class="field span2">
								<button class="submit" type="submit" disabled={loading}>
									{loading ? 'Sending…' : submitLabel}
								</button>
								<div class="smallNote">{formNote}</div>
							</div>
						</div>
					</form>
				</div>

				<div class="panelFooter">
					<span>Secure & fast setup</span>
					<a href="#tb-hero3-form" on:click={handleLinkClick}>Back to form</a>
				</div>
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

	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 56px 18px;
		overflow: hidden;
		isolation: isolate;
		color: #ffffff;
		background: #0b1220;
	}

	.bg {
		position: absolute;
		inset: 0;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		filter: saturate(1.05) contrast(1.05);
		z-index: -3;
		transform: scale(1.03);
	}

	.overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				900px 600px at 18% 25%,
				color-mix(in srgb, var(--primary) 35%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				700px 500px at 85% 70%,
				color-mix(in srgb, var(--primary) 28%, transparent) 0%,
				transparent 55%
			),
			linear-gradient(
				90deg,
				rgba(0, 0, 0, var(--overlayAlpha)) 0%,
				rgba(0, 0, 0, calc(var(--overlayAlpha) - 0.15)) 40%,
				rgba(0, 0, 0, var(--overlayAlpha)) 100%
			);
		z-index: -2;
	}

	.grain {
		position: absolute;
		inset: -30%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
		mix-blend-mode: overlay;
		opacity: 0.18;
		z-index: -1;
		pointer-events: none;
		transform: rotate(6deg);
	}

	.wrap {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 28px;
		align-items: center;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 18%, rgba(255, 255, 255, 0.08));
		border: 1px solid color-mix(in srgb, var(--primary) 30%, rgba(255, 255, 255, 0.18));
		backdrop-filter: blur(10px);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
		font-weight: 700;
		letter-spacing: 0.2px;
		width: fit-content;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		background: var(--primary);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 25%, transparent);
	}

	.left h1 {
		margin: 18px 0 14px;
		font-size: clamp(42px, 5.4vw, 68px);
		line-height: 0.95;
		letter-spacing: -1.4px;
	}

	.left :global(.accent) {
		color: var(--primary);
	}

	.left p {
		margin: 0 0 22px;
		max-width: 56ch;
		font-size: 18px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.75);
	}

	.ctaRow {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		margin-top: 12px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 14px 18px;
		border-radius: 14px;
		border: 1px solid transparent;
		text-decoration: none;
		font-weight: 800;
		font-size: 16px;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease,
			border-color 0.15s ease;
		cursor: pointer;
		user-select: none;
		min-width: 190px;
	}

	.btnPrimary {
		background: var(--primary);
		color: #101010;
		box-shadow: 0 18px 40px color-mix(in srgb, var(--primary) 35%, transparent);
	}

	.btnPrimary:hover {
		transform: translateY(-1px);
		box-shadow: 0 22px 55px color-mix(in srgb, var(--primary) 40%, transparent);
	}

	.btnGhost {
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
		border-color: rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(10px);
	}

	.btnGhost:hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.09);
		border-color: rgba(255, 255, 255, 0.26);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
	}

	.chips {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		margin-top: 18px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(10px);
		color: rgba(255, 255, 255, 0.88);
		font-weight: 700;
		font-size: 14px;
	}

	.chip svg {
		width: 18px;
		height: 18px;
		color: var(--primary);
		flex: 0 0 auto;
	}

	.panel {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 22px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(14px);
		overflow: hidden;
		position: relative;
	}

	.panelInner {
		padding: 22px;
	}

	.panelHeader {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 14px;
	}

	.spark {
		width: 34px;
		height: 34px;
		border-radius: 12px;
		background: color-mix(in srgb, var(--primary) 22%, rgba(255, 255, 255, 0.08));
		border: 1px solid color-mix(in srgb, var(--primary) 35%, rgba(255, 255, 255, 0.18));
		display: grid;
		place-items: center;
		color: var(--primary);
		flex: 0 0 auto;
	}

	.panelHeader h3 {
		margin: 0;
		font-size: 18px;
		letter-spacing: -0.2px;
	}

	.formCard {
		background: #ffffff;
		border-radius: 18px;
		padding: 18px;
		box-shadow: 0 18px 55px rgba(0, 0, 0, 0.28);
	}

	.alert {
		border-radius: 12px;
		padding: 10px 12px;
		font-size: 13px;
		margin-bottom: 12px;
	}

	.alertSuccess {
		background: rgba(16, 185, 129, 0.12);
		border: 1px solid rgba(16, 185, 129, 0.28);
		color: rgba(6, 95, 70, 0.95);
	}

	.alertError {
		background: rgba(239, 68, 68, 0.12);
		border: 1px solid rgba(239, 68, 68, 0.28);
		color: rgba(127, 29, 29, 0.95);
	}

	.formGrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field label {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.4px;
		color: rgba(16, 16, 16, 0.7);
		text-transform: uppercase;
	}

	.field input,
	.field textarea,
	.field select {
		width: 100%;
		padding: 12px 12px;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.12);
		outline: none;
		font-size: 14px;
		background: #fff;
		color: #111;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.field input:focus,
	.field textarea:focus,
	.field select:focus {
		border-color: color-mix(in srgb, var(--primary) 70%, rgba(0, 0, 0, 0.12));
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent);
	}

	.span2 {
		grid-column: span 2;
	}

	.submit {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 100%;
		padding: 14px 16px;
		border-radius: 14px;
		border: none;
		background: var(--primary);
		color: #101010;
		font-weight: 900;
		font-size: 15px;
		cursor: pointer;
		transition:
			transform 0.15s ease,
			filter 0.15s ease,
			opacity 0.15s ease;
	}

	.submit:disabled {
		cursor: not-allowed;
		opacity: 0.75;
	}

	.submit:hover {
		transform: translateY(-1px);
		filter: brightness(1.03);
	}

	.smallNote {
		margin-top: 10px;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.55);
		line-height: 1.45;
	}

	.panelFooter {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.12);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		color: rgba(255, 255, 255, 0.55);
		font-size: 13px;
	}

	.panelFooter a {
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
		font-weight: 800;
	}

	.panelFooter a:hover {
		color: #ffffff;
		text-decoration: underline;
	}

	@media (max-width: 980px) {
		.wrap {
			grid-template-columns: 1fr;
		}

		.btn {
			min-width: 0;
			width: 100%;
		}

		.ctaRow {
			width: 100%;
		}

		.formGrid {
			grid-template-columns: 1fr;
		}

		.span2 {
			grid-column: span 1;
		}
	}
</style>
