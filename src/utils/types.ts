export type Post = {
  id: string;
  name: string;
  image?: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  } | null;
  category?: {
    name: string;
  } | null;
};
