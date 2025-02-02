export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Block: {
        Row: {
          blockedId: string
          blockerId: string
          createdAt: string
          id: string
          updatedAt: string
        }
        Insert: {
          blockedId: string
          blockerId: string
          createdAt?: string
          id: string
          updatedAt?: string
        }
        Update: {
          blockedId?: string
          blockerId?: string
          createdAt?: string
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Category: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      Chat: {
        Row: {
          createdAt: string
          creatorId: string
          id: string
          isGroup: boolean
          receiverId: string
        }
        Insert: {
          createdAt?: string
          creatorId: string
          id: string
          isGroup?: boolean
          receiverId: string
        }
        Update: {
          createdAt?: string
          creatorId?: string
          id?: string
          isGroup?: boolean
          receiverId?: string
        }
        Relationships: []
      }
      Comment: {
        Row: {
          content: string
          createdAt: string
          id: string
          postId: string
          profileId: string
          updatedAt: string
        }
        Insert: {
          content: string
          createdAt?: string
          id: string
          postId: string
          profileId: string
          updatedAt?: string
        }
        Update: {
          content?: string
          createdAt?: string
          id?: string
          postId?: string
          profileId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Favorite: {
        Row: {
          createdAt: string
          id: string
          postId: string
          profileId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          postId: string
          profileId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          profileId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Follow: {
        Row: {
          createdAt: string
          followerId: string
          followingId: string
          id: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          followerId: string
          followingId: string
          id: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          followerId?: string
          followingId?: string
          id?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Message: {
        Row: {
          chatId: string
          content: string
          createdAt: string
          id: string
          isRead: boolean
          senderId: string
        }
        Insert: {
          chatId: string
          content: string
          createdAt?: string
          id: string
          isRead?: boolean
          senderId: string
        }
        Update: {
          chatId?: string
          content?: string
          createdAt?: string
          id?: string
          isRead?: boolean
          senderId?: string
        }
        Relationships: []
      }
      Notification: {
        Row: {
          createdAt: string
          id: string
          isRead: boolean
          message: string
          receiverId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          isRead?: boolean
          message: string
          receiverId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          isRead?: boolean
          message?: string
          receiverId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Post: {
        Row: {
          categoryId: string | null
          condition: Database["public"]["Enums"]["Condition"]
          createdAt: string
          description: string
          id: string
          image: string | null
          lat: number | null
          lng: number | null
          name: string
          price: number
          profileId: string
          province: string
          status: Database["public"]["Enums"]["PostStatus"]
          tags: string | null
          updatedAt: string
          views: number
        }
        Insert: {
          categoryId?: string | null
          condition: Database["public"]["Enums"]["Condition"]
          createdAt?: string
          description: string
          id: string
          image?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          price: number
          profileId: string
          province: string
          status?: Database["public"]["Enums"]["PostStatus"]
          tags?: string | null
          updatedAt?: string
          views?: number
        }
        Update: {
          categoryId?: string | null
          condition?: Database["public"]["Enums"]["Condition"]
          createdAt?: string
          description?: string
          id?: string
          image?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          price?: number
          profileId?: string
          province?: string
          status?: Database["public"]["Enums"]["PostStatus"]
          tags?: string | null
          updatedAt?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "Post_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Profile: {
        Row: {
          badgeRank: number | null
          bio: string | null
          clerkId: string
          coverImage: string | null
          createdAt: string
          email: string | null
          firstName: string
          id: string
          interests: string | null
          lastName: string
          meetingSpots: string | null
          profileImage: string | null
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          userName: string
        }
        Insert: {
          badgeRank?: number | null
          bio?: string | null
          clerkId: string
          coverImage?: string | null
          createdAt?: string
          email?: string | null
          firstName: string
          id: string
          interests?: string | null
          lastName: string
          meetingSpots?: string | null
          profileImage?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
          userName: string
        }
        Update: {
          badgeRank?: number | null
          bio?: string | null
          clerkId?: string
          coverImage?: string | null
          createdAt?: string
          email?: string | null
          firstName?: string
          id?: string
          interests?: string | null
          lastName?: string
          meetingSpots?: string | null
          profileImage?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
          userName?: string
        }
        Relationships: []
      }
      Review: {
        Row: {
          comment: string | null
          createdAt: string
          id: string
          rating: number
          revieweeId: string
          reviewerId: string
          updatedAt: string
        }
        Insert: {
          comment?: string | null
          createdAt?: string
          id: string
          rating: number
          revieweeId: string
          reviewerId: string
          updatedAt?: string
        }
        Update: {
          comment?: string | null
          createdAt?: string
          id?: string
          rating?: number
          revieweeId?: string
          reviewerId?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Trade: {
        Row: {
          createdAt: string
          id: string
          offerById: string
          offerToId: string
          postOfferedId: string
          postWantedId: string | null
          status: Database["public"]["Enums"]["TradeStatus"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          offerById: string
          offerToId: string
          postOfferedId: string
          postWantedId?: string | null
          status?: Database["public"]["Enums"]["TradeStatus"]
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          offerById?: string
          offerToId?: string
          postOfferedId?: string
          postWantedId?: string | null
          status?: Database["public"]["Enums"]["TradeStatus"]
          updatedAt?: string
        }
        Relationships: []
      }
      Verification: {
        Row: {
          createdAt: string
          documentUrl: string
          id: string
          status: Database["public"]["Enums"]["VerificationStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          documentUrl: string
          id: string
          status?: Database["public"]["Enums"]["VerificationStatus"]
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          documentUrl?: string
          id?: string
          status?: Database["public"]["Enums"]["VerificationStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Verification_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Condition: "NEW" | "USED" | "LIKE_NEW" | "REFURBISHED"
      PostStatus: "AVAILABLE" | "PENDING_TRADE" | "TRADED" | "CLOSED"
      TradeStatus:
        | "PENDING"
        | "ACCEPTED"
        | "REJECTED"
        | "CANCELLED"
        | "COMPLETED"
      UserRole: "USER" | "ADMIN" | "MODERATOR"
      VerificationStatus: "PENDING" | "APPROVED" | "REJECTED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
