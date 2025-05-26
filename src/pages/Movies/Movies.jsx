import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Card from "../Card";
import { useParams } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchMovies } from "@/util/API";

function Movies() {
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const { pageCount } = useParams();
  const { category } = useParams();

  useEffect(() => {
    if (pageCount) {
      setPage(Number(pageCount));
    }
  }, [pageCount]);

  useEffect(() => {
    async function getMovies() {
      window.scrollTo(0, 0);
      const movies = await fetchMovies(category, page);
      setData(movies);
    }
    getMovies();
  }, [category, page]);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        duration: 0.8,
        opacity: 0,
        y: -80,
        ease: "bounce",
      });
    },
    { scope: containerRef }
  );

  return (
    <>
      <Navbar />
      <div
        className="h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 w-full justify-items-center p-8 pt-28"
        ref={containerRef}
      >
        {data.map((movie, index) => (
          <Card key={index} movie={movie} />
        ))}
      </div>
      <Pagination className="text-center mx-auto my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/movies/${page}`}
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
                href={`/movies/${index + 1}`}
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
              href={`/movies/${page}`}
              onClick={() => setPage(page + 1)}
              disabled={page === 20}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Footer />
    </>
  );
}

export default Movies;
