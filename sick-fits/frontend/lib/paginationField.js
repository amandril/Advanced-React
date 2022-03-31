import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      //   console.log({ existing, args, cache });
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      //   console.log(data);
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items
      // AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN JUST SEND IT
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we don't have any items, we must go to the network to fetch them
        return false;
      }

      // If there are items, just return them from the cache, and we don't need to go to the network
      if (items.length) {
        // console.log(
        //   `There are ${items.length} items in the cache! Gonna send them to apollo`
        // );
        return items;
      }

      return false; // fallback to network

      // First it asks the read function for those items
      // either do one of two things
      // first return items because they are already in the cache
      // the other is return false from here (makes a network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the Apollo client comes back from the network with our product
      //   console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      merged.push(incoming);
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      //   console.log(merged);
      // Finally we return the merged items from the cache
      return merged;
    },
  };
}
