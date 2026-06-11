<template>
	<!-- @prop {string} id name attribute of the button -->
	<button :name="id" style="background: pink">
		<!-- @slot name of the button -->
		<slot />
	</button>
</template>

<script>
export default {
	props: {
		id: {
			type: String,
			default: ''
		}
	}
}
</script>

<docs lang="md">
Document your functional templates in docs blocks

```vue
<FunctionalButton id="test">
    In the docs block
</FunctionalButton>
```
</docs>
