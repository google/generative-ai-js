export interface ListData {
  pageSize?: number;
  pageToken?: string;
}

export interface FileMetadata {
  name?: string;
  mimeType: string;
}

export enum FilesTask {
  UPLOAD = "upload",
  LIST = "list",
  GET = "get",
  DELETE = "delete",
}