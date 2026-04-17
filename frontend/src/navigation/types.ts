import { NewsArticle } from "@/types/news";
import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Live: undefined;
  Post: undefined;
  Videos: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: { mode?: "login" | "signup" } | undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  NewsDetail: { article: NewsArticle };
  AdminUsers: undefined;
  AdminUploadNews: undefined;
  AdminUploadVlog: undefined;
  AdminUploadLive: undefined;
  ChooseState: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Privacy: undefined;
};
