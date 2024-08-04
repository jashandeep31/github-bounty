export interface IGithubRepo {
  name: string;
  full_name: string;
  private: Boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}
