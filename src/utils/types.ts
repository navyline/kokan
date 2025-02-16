// utils/types.ts

// ------------------- Profile -------------------

export type Profile = {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string | null;
  profileImage?: string | null;
  bio?: string | null;

};



// ------------------- Post -------------------
export type Post = {
  id: string;
  name: string;
  description: string;
  images: string[];
  province: string;
  lat?: number | null;
  lng?: number | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  tags?: string | null;
  profile?: Profile | null;
  category?: {
    name: string;
  } | null;
  status?: PostStatus;  // สถานะของโพสต์ เช่น "AVAILABLE"
  likesCount?: number;  // จำนวนไลค์ (ถ้ามี)
  commentsCount?: number; // จำนวนคอมเมนต์ (ถ้ามี)
  isFavorite?: boolean; // ใช้ในกรณีต้องการให้ Frontend รู้ว่าผู้ใช้ปัจจุบันกด Favorite ไหม
};

// ------------------- Enum ที่เกี่ยวข้องกับ Post -------------------
export type PostStatus = "AVAILABLE" | "PENDING_TRADE" | "TRADED" | "CLOSED";
export type Condition = "NEW" | "USED" | "LIKE_NEW" | "REFURBISHED";

// ------------------- Category -------------------
export type Category = {
  id: string;
  name: string;
};

// ------------------- Trade -------------------
export type Trade = {
  id: string;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
  offerBy: Profile;
  offerTo: Profile;
  postOffered: Post | null;
  postWanted: Post | null;
};

export type TradeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

// ------------------- Favorite -------------------
export type Favorite = {
  id: string;
  createdAt: string;
  updatedAt: string;
  post: Post | null;
  // profile?: Profile; // ถ้าจำเป็นต้องใช้
};

// ------------------- Follow -------------------
export type Follow = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  updatedAt: string;
  follower: Profile;   // โปรไฟล์คนกด Follow
  following: Profile;  // โปรไฟล์คนถูก Follow
};

// ------------------- Notification -------------------
export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  // ถ้าต้องการส่งข้อมูลเพิ่ม เช่น receiverId, updatedAt, ฯลฯ ให้เพิ่มได้
};

// ------------------- Chat -------------------
export type Chat = {
  id: string;
  creatorId: string;
  receiverId: string;
  isGroup: boolean;
  createdAt: string;
  creator: Profile;  // ผู้สร้างห้องแชท
  receiver: Profile; // ผู้เข้าร่วมอีกคน
  messages: Message[];
};

// ------------------- Message -------------------
export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: Profile; // โปรไฟล์ผู้ส่ง
};

// ------------------- ฟังก์ชัน Action (ถ้ามี) -------------------
export type actionFunction = (
  prevState: Record<string, unknown>,
  formData: FormData
) => Promise<{ message: string }>;

// ------------------- ข้อมูล Landmark/Slide (ตัวอย่างอื่น ๆ) -------------------
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
