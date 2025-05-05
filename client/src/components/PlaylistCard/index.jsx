import { AiFillCaretRight } from "react-icons/ai";
import PropTypes from "prop-types";

const PlaylistCard = ({ image, title, author }) => {
  return (
    <div className="w-60 relative bg-neutral-900 hover:bg-neutral-700 rounded-lg overflow-hidden cursor-pointer group transition p-4">
      <div className="relative w-full aspect-square rounded overflow-hidden">
        <img
          src={image ? image : "https://photo-resize-zmp3.zadn.vn/w360_r1x1_jpeg/covers/a/e/aea5c7613138aa683a539eb388342222_1325308611.jpg"}
          alt={title ? title : "Playlist Demo"}
          className="w-full h-full object-cover rounded"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition"></div>

        <button
          className="absolute bottom-2 right-2 bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <AiFillCaretRight className="w-4 h-4 text-black" />
        </button>
      </div>

      <div className="mt-3">
        <p className="text-white font-semibold truncate">{title ? title : "Playlist Demo"}</p>
        <p className="text-sm text-neutral-400">By {author ? author : "Demo author"}</p>
      </div>
    </div>
  );
};

PlaylistCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
};

export default PlaylistCard;
