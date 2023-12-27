import { FC } from "react";
import "./index.less";
import { Video } from "../../types";
interface Prop {
  selectedVideo: Video;
}
const ModalVideo: FC<Prop> = ({ selectedVideo }) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    selectedVideo;
  return (
    <iframe
      id={id}
      title={title}
      className="modal_video"
      // type="text/html"
      width="720"
      height="405"
      src={`https://www.youtube.com/embed/${id}`}
      // frameborder="0"
      // allowfullscreen
    ></iframe>
  );
};

export default ModalVideo;
