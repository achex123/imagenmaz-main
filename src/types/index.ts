export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TextToImageResponse {
  imageUrl: string;
  message?: string;
}

export interface ImageEditResponse {
  editedImageUrl: string;
  message?: string;
}

export interface EditorState {
  originalImage: string | null;
  resultImage: string | null;
  isLoading: boolean;
  edits: string[];
  currentPrompt: string;
}

export interface Action {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}
