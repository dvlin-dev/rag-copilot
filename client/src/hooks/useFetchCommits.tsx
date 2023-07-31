import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/core'; // 确保已经安装了 @octokit/core 包
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export interface Commit {
  // TODO
  html_url: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
  sha: string;
}

interface UseFetchCommitsProps {
  owner: string;
  repo: string;
  per_page: number;
  page: number;
}

export function useFetchCommits({
  owner,
  repo,
  per_page,
  page,
}: UseFetchCommitsProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommits = async () => {
      const octokit = new Octokit({
        auth: token,
      });

      try {
        const response = await octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner,
            repo,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
            per_page,
            page,
          }
        );
        //@ts-ignore
        setCommits(response.data);
        if (response.data.length < per_page) {
          setLoading(false);
        }
        console.log('res', response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCommits();
  }, [owner, repo, per_page, page]);

  return { commits, loading, error };
}
