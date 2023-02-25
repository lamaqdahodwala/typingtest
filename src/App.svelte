<script lang="ts">
  import { setContext } from "svelte";
  import Letter from "./Letter.svelte";
  import Word from "./Word.svelte";
  import { DateTime } from "luxon";
  import { diffChars } from "diff";
  import { generate_test } from "./createtest";

  let words_typed: Array<string> = [];

  let target_sentence = generate_test(100);

  let target_list = target_sentence.split(" ");

  let typed_word: string = "";

  let word_correctness: Array<Boolean> = [];

  let current_word_id: number = 0;

  let wpm: number;
  let hasStarted: boolean = false;
  let adjusted_wpm: number;
  let accuracy;

  function reset() {
    test_ended = false;
    words_typed = [];

    target_sentence = generate_test(10);

    target_list = target_sentence.split(" ");

    typed_word = "";

    word_correctness = [];

    console.log(target_sentence)

    
    current_word_id = 0;
    
    wpm = 0;
    adjusted_wpm = 0;
    accuracy = 0;
    hasStarted = false

    
    
    setTimeout(() => input.focus(), 50)
  }

  let start_time: DateTime;
  let end_time: DateTime;

  let tricky_keys = new Set();

  $: {
    if (typed_word.includes(" ")) {
      words_typed = [...words_typed, typed_word.trim()];

      let correct = typed_word.trim() === target_list[current_word_id];

      word_correctness = [...word_correctness, correct];

      typed_word = "";
      current_word_id += 1;
      if (words_typed.length === target_list.length) {
        test_ended = true;
        end_time = DateTime.now();

        let charcount = words_typed.reduce((acc, val) => {
          return acc + val.length;
        }, 0);

        let duration = end_time.diff(start_time).as("minutes");

        accuracy =
          word_correctness.filter((val) => {
            return val;
          }).length / word_correctness.length;

        wpm = charcount / 5 / duration;

        let word_changes = diffChars(target_sentence, words_typed.join(" "));

        word_changes.forEach((val) => {
          if (val.added) {
            tricky_keys = tricky_keys.add(val.value.split(""));
          }
          if (val.removed) {
            tricky_keys = tricky_keys.add(val.value.split(""));
          }
        });

        adjusted_wpm = wpm * accuracy;
      }
    }
  }

  let input: HTMLElement;

  let clicked_off: boolean = false;

  let test_ended: boolean = false;

  function oninput(event: Event & {
    currentTarget: EventTarget & HTMLInputElement}
  ){
    if (!hasStarted){
      start_time = DateTime.now();
      hasStarted = true 
    }
  }

  function keypress(event:KeyboardEvent & {
    currentTarget: EventTarget & HTMLInputElement;
}){
    
  }
</script>

<input
  bind:this={input}
  type="text"
  bind:value={typed_word}
  disabled={test_ended}
  autofocus={true}
  on:focusout={() => {
    clicked_off = true;
  }}
  on:focusin={() => {
    clicked_off = false;
  }}
  on:input={(event) => {
    oninput(event)
  }}
  on:keydown={(event) => {
    keypress(event)
  }}
  class="opacity-0"
/>

{#if !test_ended}
<div class="grid grid grid-cols-[repeat(auto-fill,_100px)]">
  {#each Array(target_list.length)
    .fill(1)
    .map((el, index) => {
      return index;
    }) as index}
    <div class="">
      <Word
        {words_typed}
        {current_word_id}
        {target_list}
        {typed_word}
        word_id={index}
      />
    </div>
  {/each}
</div>
{/if}
{#if clicked_off}
  {#if test_ended}
    <p>You finished the test!</p>

    <p>
      Accuracy: {100 *
        (word_correctness.filter((val) => {
          return val;
        }).length /
          word_correctness.length)}%
    </p>
    <p>
      Time taken: {end_time
        .diff(start_time, ["seconds"])
        .toHuman({ unitDisplay: "short" })}
    </p>
    <p>WPM: {wpm}</p>
    <p>Adjusted WPM: {adjusted_wpm}</p>
    {#if Array.from(tricky_keys).length === 0}
      <p>No tricky keys!</p>
    {:else}
      <p>Tricky keys: {Array.from(tricky_keys)}</p>
    {/if}
    
    <button
      on:click={() => {
        reset();
      }}>Retake test</button
    >
    {:else}
    <div class="grid items-center relative bottom-1/2">
      <button
      class="bg-red-100 text-3xl p-6"
      on:click={() => {
        input.focus();
      }}>Click to refocus</button
        >
    </div>
  {/if}
{/if}

<style lang="postcss">
  @tailwind base;
  @tailwind utilities;
  @tailwind components;
</style>
