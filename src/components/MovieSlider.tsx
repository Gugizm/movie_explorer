import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Navigation,
} from "swiper/modules";
import { Movie } from "../types/Movie";
import { useNavigate } from "react-router-dom";
import { config } from "../constants/config";

interface MovieSliderProps {
  movies: Movie[];
}

export default function MovieSlider({ movies }: MovieSliderProps) {
  const navigate = useNavigate();

  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      navigation={true}
      loop={true}
      modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
      className="mySwiper mb-8"
    >
      {movies.slice(0, 40).map((movie) => (
        <SwiperSlide
          key={movie.id}
          className="max-w-xs cursor-pointer"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          <div className="relative h-96">
            <img
              src={`${config.IMAGE_BASE_URL}/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h3 className="text-xl font-bold text-white">{movie.title}</h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
