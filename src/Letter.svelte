<script lang="ts">
    export let letter_id: number 
    export let current_letter: string
    export let current_word: string
    export let typed_word: string
    export let active: boolean

    let correct_letter = current_word[letter_id]
    $: given_letter = typed_word[letter_id]





</script>




{#if active}
    {#if correct_letter === given_letter}
        <letter class="font-bold">{current_letter}</letter>
    {:else if given_letter === undefined}
        <letter class="text-gray-400">{current_letter}</letter>
    {:else if correct_letter === undefined}
        <letter class="text-red-800">{given_letter}</letter>
    {:else}
        <letter class="text-red-500">{correct_letter}</letter>
    {/if}
{:else}
    <letter class="text-gray-400">{current_letter}</letter>

{/if}