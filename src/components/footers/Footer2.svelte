<script>
	export let website;
	export let data = {};
	export let pb;

	// Your footer logic here
</script>

<footer class="bg-gray-900 text-white py-8">
	<div class="max-w-7xl mx-auto px-4">
		<div class="text-center">
			<h3 class="text-xl font-bold mb-4">{website.business_name}</h3>
			<p class="text-gray-400">{data.copyright_text || '© 2024 All rights reserved'}</p>
		</div>
	</div>
</footer>

<style>
	/* Your styles here */
</style>
