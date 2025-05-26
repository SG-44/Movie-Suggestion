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
  var { pageCount } = useParams();

  useEffect(() => {
    if (pageCount) {
      setPage(Number(pageCount));
    }
  }, [pageCount]);

  useEffect(() => {
    async function getActors() {
      window.scrollTo(0, 0);
      const actors = await fetchActors(page);
      setData(actors);
    }
    getActors();
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 w-full justify-items-center p-8 pt-28">
        {data
          .filter((actor) => actor.profile_path)
          .filter((actor) => actor.known_for_department === "Acting")
          .map((data, index) => (
            <CardActor key={index} data={data} />
          ))}
      </div>
      <Pagination className="text-center mx-auto my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/actors/${page}`}
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
              className={page === 1 ? "hidden" : ""}
            />
          </PaginationItem>
          {/* First page always visible if not on first */}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink
                href={`/actors/1`}
                isActive={false}
                onClick={() => setPage(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          {/* Ellipsis if more than two pages before current */}
          {page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {/* Previous page if not on first */}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink
                href={`/actors/${page}`}
                isActive={false}
                onClick={() => setPage(page - 1)}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {/* Current page */}
          <PaginationItem>
            <PaginationLink
              href={`/actors/${page}`}
              isActive={true}
              onClick={() => setPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {/* Next page if not on last */}
          {page < 20 && (
            <PaginationItem>
              <PaginationLink
                href={`/actors/${page}`}
                isActive={false}
                onClick={() => setPage(page + 1)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {/* Ellipsis if more than two pages after current */}
          {page < 18 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {/* Last page always visible if not on last */}
          {page < 19 && (
            <PaginationItem>
              <PaginationLink
                href={`/actors/20`}
                isActive={false}
                onClick={() => setPage(20)}
              >
                20
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href={`/actors/${page}`}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Footer />
    </>
  );
};

export default Actors;
