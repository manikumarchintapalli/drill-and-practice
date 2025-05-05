import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getAuthenticatedUser } from "../lib/authUtils";
import http, { queryClient } from "./http";


export interface WebsiteData {
  homePage?: Record<string, any>;
  navbar?: {
    links: Array<{ label: string; value: string }>;
    logo?: string;
    brand?: string;
  };
  [key: string]: any;
}

export const useWebsiteData = () =>
  useQuery<WebsiteData, Error>({
    queryKey: ["websiteData"],
    queryFn: () => axios.get("/websiteData.json").then(res => res.data),
  });



export interface Course {
  id: string;
  title: string;
  description?: string;
  [key: string]: any;
}

export const useGetCoursesService = () =>
  useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await http.get<Course[]>("/api/courses");
      return res.data;
    },
  });

export const useAddCourseService = () =>
  useMutation<Course, Error, Partial<Course>>({
    mutationFn: async (newCourse) => {
      const res = await http.post<Course>("/api/courses", newCourse);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["courses"]});
    },
  });



export interface Topic {
  id?: string;
  name: string;
  courseId?: string;
  [key: string]: any;
}

export const useGetAllTopicsService = () =>
  useQuery<Topic[], Error>({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await http.get<Topic[]>("/api/topics");
      return res.data;
    },
  });

export const useGetTopicsService = (courseId: string) =>
  useQuery<Topic[], Error>({
    queryKey: ["topics", courseId],
    queryFn: async () => {
      const res = await http.get<Topic[]>(`/api/topics?courseId=${courseId}`);
      return res.data;
    },
    enabled: Boolean(courseId),
  });

export const useAddTopicService = () =>
  useMutation<Topic, Error, Partial<Topic>>({
    mutationFn: async (newTopic) => {
      const res = await http.post<Topic>("/api/topics", newTopic);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["topics"]});
    },
  });



export interface Question {
  _id: string;
  topic?: string;
  text: string;
  solution?: string;
  [key: string]: any;
}

export const useGetAllQuestionsService = () =>
  useQuery<Question[], Error>({
    queryKey: ["all-questions"],
    queryFn: async () => {
      const res = await http.get<Question[]>("/api/problems");
      return res.data;
    },
  });

export const useCreateQuestionService = () =>
  useMutation<Question, Error, Omit<Question, "_id">>({
    mutationFn: async (payload) => {
      const res = await http.post<Question>("/api/problems", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["all-questions"]});
    },
  });

export const useUpdateQuestionService = () =>
  useMutation<Question, Error, { id: string } & Partial<Question>>({
    mutationFn: async ({ id, ...updates }) => {
      const res = await http.put<Question>(`/api/problems/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["all-questions"]});
    },
  });

export const useDeleteQuestionService = () =>
  useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await http.delete(`/api/problems/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["all-questions"]});
    },
  });



export interface TopicStats {
  attempted: number;
  correct: number;
  solved?: string[];
}

export type DashboardStats = Record<string, TopicStats>;

export const useDashboardStatsService = () =>
  useQuery<DashboardStats, Error>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await http.get<DashboardStats>("/api/dashboard/dashboard-stats");
      return res.data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

export const useUpdateDashboardStatsService = () =>
  useMutation<void, Error, { topic: string; isCorrect: boolean }>({
    mutationFn: async ({ topic, isCorrect }) => {
      if (!topic || typeof isCorrect !== "boolean") {
        throw new Error("Invalid dashboard update payload");
      }
      await http.post("/api/dashboard/update-dashboard", { topic, isCorrect });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["dashboardStats"]});
    },
  });

export const useResetDashboardStatsService = () =>
  useMutation<void, Error>({
    mutationFn: async () => {
      await http.post("/api/dashboard/reset-dashboard");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["dashboardStats"]});
    },
  });



export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role?: string;
  [key: string]: any;
}



export const useSignInService = () =>
  useMutation<AuthResponse, Error, SignInPayload>({
    mutationFn: async (data) => {
      const res = await http.post<string>("/api/user/sign-in", data);
      return { token: res.data }; // res.data is directly the JWT string
    },
  });

export const useAdminSignInService = () =>
  useMutation<AuthResponse, Error, SignInPayload>({
    mutationFn: async (data) => {
      const res = await http.post<string>("/api/admin/sign-in", data);
      return { token: res.data };
    },
  });


export interface SignUpPayload {
  email: string;
  password: string;
  username: string;
  dob: string;
  phoneNo: string;
  role: "user" | "admin";
}



export const useSignUpService = () =>
  useMutation<AuthResponse, Error, SignUpPayload>({
    mutationFn: async (data) => {
      const res = await http.post<string>("/api/user/sign-up", data);
      return { token: res.data };
    },
  });

  export interface ProfileData {
    _id: string;
    username: string;
    email: string;
    phoneNo?: string;
    dob?: string;
    avatar?: string;
  }
  
  export const useGetUserProfileService = () => {
    const user = getAuthenticatedUser();
    return useQuery<ProfileData, Error>({
      queryKey: ["userProfile", user?._id],
      queryFn: async () => {
        const res = await http.get<ProfileData>(`/api/user/profile/${user?._id}`);
        return res.data;
      },
      enabled: Boolean(user?._id),
    });
  };
  
  export const useUpdateUserProfileService = () =>
    useMutation<ProfileData, Error, ProfileData>({
      mutationFn: async (body) => {
        const { _id, ...updates } = body;
        const res = await http.put<ProfileData>(`/api/user/profile/${_id}`, updates);
        return res.data;
      },
      onSuccess: (data) => {
        queryClient.setQueryData(["userProfile", data._id], data);
      },
    });
    
  export const useResetPasswordService = () =>
    useMutation<any, Error, { currentPassword: string; newPassword: string }>({
      mutationFn: async (data) => {
        const res = await http.post("/api/user/reset-password", data);
        return res.data;
      },
    });