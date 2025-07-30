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

  useEffect(() => {
    if (pageCount) {
      setPage(Number(pageCount));
    }
  }, [pageCount]);

  useEffect(() => {
    async function getMovies() {
      window.scrollTo(0, 0);
      const movies = await fetchActors();
      setData(movies);
    }
    getMovies();
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 w-full justify-items-center p-8 pt-28">
        {data.map((data, index) => (
          <CardActor key={index} data={data} />
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
              }}
              className={page === 1 ? "hidden" : ""}
            />
          </PaginationItem>
          {data.slice(0, 3).map((pageInfo, index) => (
            <PaginationItem key={data[index].id}>
              <PaginationLink
                href={`/Movie-Suggestion/#/actors/${index + 1}`}
                isActive={index + 1 === page}
                onClick={() => {
                  setPage(index + 1);
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
              onClick={() => setPage(page + 1)}
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
