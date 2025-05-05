import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";
import { notify } from "../../components/Toast";

const GenreContext = React.createContext();

const GenreProvider = ({ children }) => {
    const [genreList, setGenreList] = useState([]);
    const [loadingFetchGenreList, setLoadingFetchGenreList] = useState(false);

    // Fetch genre list
    const fetchGenreList = useCallback(async () => {
        try {
            setLoadingFetchGenreList(true);
            const response = await instance.get(apis.genres.getAll());
            console.log("Fetched genre list:", response.data); // Log danh sách thể loại
            if (response.status === 200) {
                setGenreList(response.data);
            }
        } catch (error) {
            console.error("Error fetching genres:", error.response);
            notify("Failed to fetch genres", "error");
        } finally {
            setLoadingFetchGenreList(false);
        }
    }, []);

    // Create a new genre
    const createGenre = useCallback(async (formData) => {
        try {
            const response = await instance.post(apis.genres.create(), formData);
            if (response.status === 201) {
                notify("Genre created successfully");
                await fetchGenreList(); // Refresh the list
            } else {
                throw new Error("Failed to create genre");
            }
        } catch (error) {
            console.error("Error creating genre:", error.response);
            notify("Failed to create genre", "error");
            throw error;
        }
    }, [fetchGenreList]);

    const updateGenre = useCallback(async (genreId, formData) => {
        console.log("Updating genre with ID:", genreId, "and data:", formData); // Log dữ liệu
        try {
            const response = await instance.put(apis.genres.update(genreId), formData);
            if (response.status === 200) {
                notify("Genre updated successfully");
                await fetchGenreList(); // Refresh the list
            } else {
                throw new Error("Failed to update genre");
            }
        } catch (error) {
            notify("Failed to update genre", "error");
            throw error;
        }
    }, [fetchGenreList]);
    // Delete genres
        const handleDeleteGenres = useCallback(async (genreIds) => {
        console.log("Deleting genres with IDs:", genreIds); // Log danh sách ID
        try {
            const response = await instance.post(apis.genres.delete(), {
                genre_ids: genreIds,
            });
            if (response.status === 200) {
                notify("Genres deleted successfully");
                await fetchGenreList(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting genres:", error.response?.data || error.message); // Log lỗi chi tiết
            notify("Failed to delete genres", "error");
        }
    }, [fetchGenreList]);

    return (
        <GenreContext.Provider
            value={{
                genreList,
                fetchGenreList,
                loadingFetchGenreList,
                createGenre,
                updateGenre,
                handleDeleteGenres,
            }}
        >
            {children}
        </GenreContext.Provider>
    );
};

export const useGenre = () => React.useContext(GenreContext);
export default React.memo(GenreProvider);