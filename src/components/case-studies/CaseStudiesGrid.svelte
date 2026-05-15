<script>
	import { getColorClasses, getImageUrl } from './colors.js';

	export let website;
	export let pb;
	export let caseStudies = [];
	export let heading = 'Case Studies';

	$: colors = getColorClasses(website?.color_scheme);
</script>

<section class="py-16 bg-white">
	<div class="max-w-6xl mx-auto px-4">
		<div class="text-center mb-10">
			<h1 class="text-3xl md:text-4xl font-bold text-gray-900">{heading}</h1>
			<div class="w-16 h-1 mx-auto mt-4 {colors.bg}"></div>
		</div>

		{#if caseStudies.length === 0}
			<p class="text-center text-gray-500">No case studies to show yet.</p>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each caseStudies as cs}
					{@const img = getImageUrl(pb, cs.cover_image, { thumb: '600x400' })}
					<a
						href={`/case-studies/${cs.slug}`}
						class="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
					>
						<div class="aspect-[3/2] bg-gray-100 overflow-hidden">
							{#if img}
								<img src={img} alt={cs.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-300">
									<i class="fa-solid fa-image text-4xl"></i>
								</div>
							{/if}
						</div>
						<div class="p-5">
							{#if cs.related_service || cs.related_location}
								<p class="text-xs uppercase tracking-wider {colors.text} mb-2">
									{cs.related_service || ''}{cs.related_service && cs.related_location ? ' • ' : ''}{cs.related_location || ''}
								</p>
							{/if}
							<h3 class="text-lg font-semibold text-gray-900">{cs.title}</h3>
							{#if cs.summary}
								<p class="mt-2 text-sm text-gray-600 line-clamp-3">{cs.summary}</p>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
