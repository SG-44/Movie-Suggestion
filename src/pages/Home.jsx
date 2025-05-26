import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Card from "./Card.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { fetchMovies } from "../util/API.js";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";
// import { useParams } from "react-router";

function Home() {
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [page, setPage] = useState(1);

  // const pageCount = useParams();

  // setPage(pageCount);

  useEffect(() => {
    async function getMovies() {
      const movies = await fetchMovies(page);
      setData(movies);
      setIsContentLoaded(true);
    }
    getMovies();
  }, [page]);

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
        className="h-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 w-full justify-items-center p-8 pt-28"
        ref={containerRef}
      >
        {data.map((movie, index) => (
          <Card key={index} movie={movie} />
        ))}
      </div>
      <Pagination className="text-center mx-auto my-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`/page=${1}`} />
          </PaginationItem>
          {data.map((index) => {
            <PaginationItem key={index}>
              <PaginationLink
                href={`/page=${page}`}
                isActive
                onClick={() => setPage(index)}
              >
                {index}
              </PaginationLink>
            </PaginationItem>;
          })}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/page=${1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {isContentLoaded && <Footer />}
    </>
  );
}

export default Home;
