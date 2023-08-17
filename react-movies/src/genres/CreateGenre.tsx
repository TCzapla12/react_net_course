import axios from "axios";
import GenreForm from "./GenreForm";
import { genreCreationDTO } from "./genres.model";
import { urlGenres } from "../endpoints";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DisplayErrors from "../utils/DisplayErrors";

export default function CreateGenre() {
    const history = useNavigate();
    const [errors, setErrors] = useState<string[]>([]);

    async function create(genre: genreCreationDTO){
        try{
            await axios.post(urlGenres, genre);
            history("/genres");
        }
        catch (error: any)
        {
            console.error(error);
            if(error && error.response) {
                setErrors(error.response.data);
            }
        }
    }

    return (
        <>
            <h3>Create Genre</h3>
            <DisplayErrors errors={errors} />
            <GenreForm model={{ name: '' }} 
            onSubmit={async values => {
                await create(values);
            }} />
        </>
    )
}