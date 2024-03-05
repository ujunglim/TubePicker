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

export interface Folder {
  id: number;
  name: string;
  subList: any[]
}
