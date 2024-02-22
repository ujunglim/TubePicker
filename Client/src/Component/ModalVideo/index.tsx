import { FC } from "react";
import styles from "./index.module.scss";
interface Prop {
  id?: string;
  title: string;
  channelTitle?: string;
  description?: string;
  publishedAt?: string;
  thumbnails?: any;
}
const ModalVideo: FC<Prop> = ({
  id,
  title,
  channelTitle,
  description,
  publishedAt,
  thumbnails,
}) => {
  return (
    <iframe
      id={id}
      title={title}
      className={styles.modal_video}
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
