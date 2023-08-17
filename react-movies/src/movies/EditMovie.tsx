import { useEffect, useState } from "react";
import MovieForm from "./MovieForm";
import axios, { AxiosResponse } from "axios";
import { urlMovies } from "../endpoints";
import { useNavigate, useParams } from "react-router-dom";
import { movieCreationDTO, moviePutGetDTO } from "./movies.model";
import { convertMovieToFormData } from "../utils/formDataUtils";
import DisplayErrors from "../utils/DisplayErrors";
import Loading from "../utils/Loading";

export default function EditMovie() {
  const { id }: any = useParams();
  const [movie, setMovie] = useState<movieCreationDTO>();
  const [moviePutGet, SetMoviePutGet] = useState<moviePutGetDTO>();
  const [errors, setErrors] = useState<string[]>([]);
  const history = useNavigate();

  useEffect(() => {
    axios.put(`${urlMovies}/putGet/${id}`).then((response: AxiosResponse<moviePutGetDTO>) => {
      const model: movieCreationDTO = {
        title: response.data.movie.title,
        inTheaters: response.data.movie.inTheaters,
        trailer: response.data.movie.trailer,
        posterURL: response.data.movie.poster,
        summary: response.data.movie.summary,
        releaseDate: new Date(response.data.movie.releaseDate),
      };

      setMovie(model);
      SetMoviePutGet(response.data);
    });
  }, [id]);

  async function edit(movieToEdit: movieCreationDTO) {
    try{
      const formData = convertMovieToFormData(movieToEdit);
      await axios({ method: 'put', url: `${urlMovies}/${id}`, data: formData, headers: {'Content-Type': 'multipart/form-data'}});
      history(`/movie/${id}`);
    }
    catch(error: any){
      setErrors(error.response.data)
    }
  }

  return (
    <>
      <h3>Edit Movie</h3>
      <DisplayErrors errors={errors} />
      {movie && moviePutGet ? <MovieForm
        model={movie}
        onSubmit={async values => await edit(values)}
        nonSelectedGenres={moviePutGet.nonSelectedGenres}
        selectedGenres={moviePutGet.selectedGenres}
        nonSelectedMovieTheaters={moviePutGet.nonSelectedMovieTheaters}
        selectedMovieTheaters={moviePutGet.selectedMovieTheaters}
        selectedActors={moviePutGet.actors}
      /> : <Loading />}
      
    </>
  );
}
