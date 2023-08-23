declare interface CreateProject {
  name: string;
  description: string;
  prompt: string;
  questions: string[];
  whiteList: string[];
  ipLimit: string;
}

declare interface UpdateProject {
  id: string;
  name?: string;
  description?: string;
  prompt?: string;
  questions?: string[];
  whiteList?: string[];
  ipLimit?: string;
  docIds?: string[];
}
