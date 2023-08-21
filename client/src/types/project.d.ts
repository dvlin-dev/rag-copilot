declare interface CreateProject {
  name: string;
  description: string;
  prompt: string;
  questions: string[];
  whiteList: string[];
  ipLimit: string;
}
