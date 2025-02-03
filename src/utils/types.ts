export type Profile = {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string | null;
  profileImage?: string | null;
};

export type Post = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  province: string;
  lat?: number | null;
  lng?: number | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  tags?: string | null;
  profile: Profile | null;
  category?: {
    name: string;
  } | null;
};

export type Trade = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  offerBy: Profile;
  offerTo: Profile;
  postOffered: Post | null;
  postWanted: Post | null; 
};

export type Category = {
  id: string;
  name: string;
};

export type TradeStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export type actionFunction = (
  prevState: Record<string, unknown>,
  formData: FormData
) => Promise<{ message: string }>;

export type LandmarkCardProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  province: string;
  price: number;
  lat: number;
  lng: number;
};

export type CurrentSlideData = {
  data: LandmarkCardProps;
  index: number;
};
// export type CurrentSlideData = {
//   data: LandmarkCardProps;
//   // index: number;
// };