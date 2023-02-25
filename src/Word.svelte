<script lang="ts">
  import { getContext } from "svelte";
    import Letter from "./Letter.svelte";
    export let word_id: number 
    export let current_word_id: number
    export let target_list: Array<string>
    export let words_typed 
    export let typed_word: string


    let correct_word = target_list[word_id]

    $: letters = correct_word.split("")


    $: active = current_word_id === word_id



</script>





{#if current_word_id > word_id}

    {#each words_typed[word_id].split("") as letter, i}
        <Letter letter_id={i} active={true} current_word={correct_word} current_letter={letter} typed_word={words_typed[word_id]}></Letter>
    {/each}
{:else}
    {#each letters as letter, i}
    <Letter letter_id={i} active={active} current_word={correct_word} current_letter={letter} typed_word={typed_word}></Letter>
    {/each}
    
{/if}
{#if active}
    {#if typed_word.length > correct_word.length}
        {#each typed_word.slice(correct_word.length).split("") as i}
            <letter class="text-red-800">{i}</letter>
        {/each}
    {/if}
{/if}