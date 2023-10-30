const Content = (video: any) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  return (
    <div>{<img src={thumbnails.medium.url} alt="thumbnail" />}</div>
    // <div key={title}>
    //   {/* <p>{title}</p> */}
    //   {/* <img src={thumbnails.medium.url} alt="" /> */}
    //   <iframe
    //     id={id}
    //     title={title}
    //     // type="text/html"
    //     width="720"
    //     height="405"
    //     src={`https://www.youtube.com/embed/${id}`}
    //     // frameborder="0"
    //     // allowfullscreen
    //   ></iframe>
    // </div>
  );
};

export default Content;
