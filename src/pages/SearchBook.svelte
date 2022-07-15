<script lang="ts">
  import { books } from '../store/book';
  import { onDestroy } from 'svelte';
  import InfiniteScroll from 'svelte-infinite-scroll';

  import SearchBar from '../components/SearchBar.svelte';
  import BookCard from '../components/BookCard.svelte';
  import Spinner from '../components/Spinner.svelte';
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory';

  const BookRepository = RepositoryFactory[BOOK];

  let q = '';
  let empty = false;
  let promise: Promise<void>;
  let startIndex = 0;
  let totalItems = 0;

  // writableオブジェクトに対してsubscribeメソッドを呼び出すことでストアのオブジェクトを監視する
  // subscribeメソッドは返り値としてストアのオブジェクトの監視を破棄するメソッドを返す
  // $を使うシンタックスシュガーも存在
  // const unsubscribe = books.subscribe((value) => (_books = value));

  // コンポーネントが破棄されたときに呼ばれるライフサイクルフック
  // onDestroy(unsubscribe);

  $: hasMore = totalItems > $books.length;

  const handleSubmit = () => {
    if (!q.trim()) return;
    promise = getBooks();
  };

  const getBooks = async () => {
    books.reset();
    empty = false;
    startIndex = 0;
    const result = await BookRepository.get({ q });
    empty = result.totalItems === 0;
    totalItems = result.totalItems;
    books.add(result.items);
  };

  const handlerLoadMore = () => {
    startIndex += 10;
    promise = getNextPage();
  };

  const getNextPage = async () => {
    const result = await BookRepository.get({ q, startIndex });

    // 取得データが既に存在する可能性もあるため、idでフィルタリング
    const bookIds = $books.map((book) => book.id);
    const filteredItems = result.items.filter((item) => !bookIds.includes(item.id));

    books.add(filteredItems);
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
    <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {#each $books as book (book.id)}
        <BookCard {book} />
      {/each}
    </div>
  {/if}

  <InfiniteScroll window threshold={100} on:loadMore={handlerLoadMore} {hasMore} />

  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
  {:catch e}
    <span class="text-red-600 text-sm">
      {e.message}
    </span>
  {/await}
</div>
