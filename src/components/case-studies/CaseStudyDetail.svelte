<script>
	import { getColorClasses, getImageUrl } from './colors.js';

	export let website;
	export let pb;
	export let caseStudy;

	$: colors = getColorClasses(website?.color_scheme);
	$: cover = getImageUrl(pb, caseStudy?.cover_image, { thumb: '1600x900' });
	$: gallery = Array.isArray(caseStudy?.gallery_images) ? caseStudy.gallery_images : [];

	function formatDate(iso) {
		if (!iso) return '';
		try {
			return new Date(iso).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return '';
		}
	}
</script>

<article class="bg-white">
	<header class="relative {cover ? 'aspect-[21/9]' : 'py-16'} bg-gray-100">
		{#if cover}
			<img src={cover} alt={caseStudy.title} class="absolute inset-0 w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
		{/if}
		<div class="absolute inset-0 flex items-end">
			<div class="max-w-4xl mx-auto px-4 pb-10 w-full {cover ? 'text-white' : 'text-gray-900'}">
				{#if caseStudy.related_service || caseStudy.related_location}
					<p class="text-xs uppercase tracking-widest mb-3 opacity-90">
						{caseStudy.related_service || ''}{caseStudy.related_service && caseStudy.related_location ? ' • ' : ''}{caseStudy.related_location || ''}
					</p>
				{/if}
				<h1 class="text-3xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
				{#if caseStudy.summary}
					<p class="text-lg md:text-xl max-w-2xl opacity-90">{caseStudy.summary}</p>
				{/if}
			</div>
		</div>
	</header>

	{#if caseStudy.client_name || caseStudy.results || caseStudy.published_at}
		<div class="border-b border-gray-200 bg-gray-50">
			<div class="max-w-4xl mx-auto px-4 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
				{#if caseStudy.client_name}
					<div>
						<p class="text-xs uppercase tracking-wider text-gray-500 mb-1">Client</p>
						<p class="text-gray-900 font-medium">{caseStudy.client_name}</p>
					</div>
				{/if}
				{#if caseStudy.results}
					<div>
						<p class="text-xs uppercase tracking-wider text-gray-500 mb-1">Outcome</p>
						<p class="text-gray-900 font-medium">{caseStudy.results}</p>
					</div>
				{/if}
				{#if caseStudy.published_at}
					<div>
						<p class="text-xs uppercase tracking-wider text-gray-500 mb-1">Completed</p>
						<p class="text-gray-900 font-medium">{formatDate(caseStudy.published_at)}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="max-w-3xl mx-auto px-4 py-12">
		{#if caseStudy.body}
			<div class="prose max-w-none text-gray-800 leading-relaxed">
				{@html caseStudy.body}
			</div>
		{:else}
			<p class="text-gray-500">No further details provided.</p>
		{/if}
	</div>

	{#if gallery.length > 0}
		<div class="max-w-6xl mx-auto px-4 pb-16">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{#each gallery as img}
					{@const url = getImageUrl(pb, img, { thumb: '800x600' })}
					<div class="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
						{#if url}
							<img src={url} alt={img.alt_text || caseStudy.title} class="w-full h-full object-cover" />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="max-w-4xl mx-auto px-4 pb-16">
		<a href="/case-studies" class="inline-flex items-center gap-2 {colors.text} font-semibold hover:underline">
			<i class="fa-solid fa-arrow-left text-xs"></i>
			Back to all case studies
		</a>
	</div>
</article>
