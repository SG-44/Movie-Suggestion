import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Card from "./Card";
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
  const { pageCount, category } = useParams();

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
              href={`/movies/${category}/${page}`}
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
                href={`/movies/${category}/1`}
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
                href={`/movies/${category}/${page}`}
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
              href={`/movies/${category}/${page}`}
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
                href={`/movies/${category}/${page}`}
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
                href={`/movies/${category}/20`}
                isActive={false}
                onClick={() => setPage(20)}
              >
                20
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href={`/movies/${category}/${page}`}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Footer />
    </>
  );
}

export default Movies;
