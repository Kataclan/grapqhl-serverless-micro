export interface Post {
  title: string;
  content: string;
}

export interface User {
  pid: number;
  name: string;
  surname: string;
  email: string;
  posts: string[];
}
