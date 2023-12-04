import "./index.less";

const VideoContent = ({ video }: any) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  return (
    <div key={title} className="video_content_box">
      <div className="video_img">
        <img src={thumbnails.medium.url} alt="thumbnail" />
      </div>
      <p className="title">{title}</p>
      <p className="subtitle">{channelTitle}</p>
      <p className="subtitle">{"날짜"}</p>
      {/* <iframe
        id={id}
        title={title}
        // type="text/html"
        width="720"
        height="405"
        src={`https://www.youtube.com/embed/${id}`}
        // frameborder="0"
        // allowfullscreen
      ></iframe> */}
    </div>
  );
};

export default VideoContent;
