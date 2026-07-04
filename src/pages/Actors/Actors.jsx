import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchActors } from "@/util/API";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CardActor from "./CardActor";

const Actors = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const { pageCount } = useParams();
  const PAGE_SIZE = 24;
  const MAX_PAGES_TO_FETCH = 20;

  useEffect(() => {
    if (pageCount) {
      setPage(Number(pageCount));
    }
  }, [pageCount]);

  useEffect(() => {
    async function getActors() {
      const currentPage = Number(pageCount ?? 1);
      const uniqueActors = [];
      const seenIds = new Set();
      let pageToFetch = 1;

      while (
        uniqueActors.length < currentPage * PAGE_SIZE &&
        pageToFetch <= MAX_PAGES_TO_FETCH
      ) {
        const fetchedActors = await fetchActors(pageToFetch);

        fetchedActors.forEach((actor) => {
          const hasProfilePicture = actor.profile_path !== null;
          const hasSoftcoreWork = (actor.known_for ?? []).some(
            (work) => work.softcore === true,
          );

          if (hasProfilePicture && !hasSoftcoreWork && !seenIds.has(actor.id)) {
            seenIds.add(actor.id);
            uniqueActors.push(actor);
          }
        });

        pageToFetch += 1;
      }

      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      setData(uniqueActors.slice(startIndex, endIndex));
    }

    getActors();
  }, [pageCount]);

  return (
    <>
      <Navbar />
      <div className="h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 w-full justify-items-center p-8 pt-28">
        {data.map((actor, index) => (
          <CardActor key={actor.id ?? index} data={actor} />
        ))}
      </div>
      <Pagination className="text-center mx-auto my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/Movie-Suggestion/#/actors/${page}`}
              onClick={() => {
                if (page >= 1) {
                  setPage(page - 1);
                } else {
                  setPage(1);
                }
                scrollTo(0, 0);
              }}
              className={page === 1 ? "hidden" : ""}
            />
          </PaginationItem>
          {data.slice(0, 3).map((_, index) => (
            <PaginationItem key={data[index].id}>
              <PaginationLink
                href={`/Movie-Suggestion/#/actors/${index + 1}`}
                isActive={index + 1 === page}
                onClick={() => {
                  setPage(index + 1);
                  scrollTo(0, 0);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`/Movie-Suggestion/#/actors/${page}`}
              onClick={() => {
                setPage(page + 1);
                scrollTo(0, 0);
              }}
              disabled={page === 20}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Footer />
    </>
  );
};

export default Actors;
