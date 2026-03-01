import { Timestamp, FieldValue } from "firebase/firestore";

export type UserRole = 'admin' | 'presenter' | 'audience';

export interface User {
  uid: string;
  role: UserRole;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    [key: string]: unknown;
  };
}

export type PresentationStatus = 'draft' | 'live' | 'ended';

export interface PresentationConfig {
  requireName: boolean;
  allowAnonymous: boolean;
  accentColor: string;
}

export interface Presentation {
  id: string;
  ownerId: string;
  title: string;
  accessCode: string;
  status: PresentationStatus;
  activeSlideId: string | null;
  currentSessionId: string | null;
  config: PresentationConfig;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

export interface PresentationSession {
  id: string;
  presentationId: string;
  startedAt: Timestamp | FieldValue;
  endedAt?: Timestamp | FieldValue | null;
  participantCount: number;
}

export type SlideType =
  | 'heading'
  | 'mcq'
  | 'wordcloud'
  | 'qa'
  | 'scale'
  | 'ranking'
  | 'pin_image'
  | 'matrix'
  | 'spin_wheel';

export interface SlideOption {
  id: string;
  label: string;
  color?: string;
  isCorrect?: boolean;
}

export interface SlideMatrixLabels {
  x_axis: string;
  y_axis: string;
}

export interface SlideScaleRange {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface SlideSettings {
  hideResults: boolean;
  timer: number; // in seconds, 0 = no timer
  profanityFilter: boolean;
}

export interface SlideContent {
  question: string;
  subtext?: string;
  image_url?: string;
  code_snippet?: string;
  code_language?: string;
  options?: SlideOption[];
  matrix_labels?: SlideMatrixLabels;
  scale_range?: SlideScaleRange;
}

export interface Slide {
  id: string;
  presentationId: string;
  type: SlideType;
  order: number;
  content: SlideContent;
  settings: SlideSettings;
}

export type SessionStatus = 'active' | 'background';

export interface Session {
  id: string;
  presentationId: string;
  socketId: string; // fingerprint
  userData: {
    name?: string;
    email?: string;
    teamName?: string;
  };
  joinedAt: Timestamp | FieldValue;
  lastActiveAt: Timestamp | FieldValue;
  status: SessionStatus;
}

export interface ResponseData {
  optionId?: string; // for MCQ
  text?: string; // for Word Cloud
  coordinates?: { x: number; y: number }; // for Pin on Image / Matrix
  rating?: number; // for Scales
  rank_order?: string[]; // array of option ids, for Ranking
}

export interface Response {
  id: string;
  presentationId: string;
  slideId: string;
  participantId: string; // Session ID or User ID if logged in
  data: ResponseData;
  createdAt: Timestamp | FieldValue;
}
