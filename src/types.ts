export interface Video {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    medium: {
      url: string;
      height: number;
      width: number;
    };
  };
}
