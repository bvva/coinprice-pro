import { NewsResponse, NewsItem } from '../types';

export class NewsService {
  private baseUrl = 'https://ppproxy.vercel.app/api/edge?url=https://www.techflowpost.com/ashx/newflash_index.ashx';

  async fetchNews(pageIndex: number = 1, pageSize: number = 10): Promise<NewsItem[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en,zh;q=0.9,zh-CN;q=0.8',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'pragma': 'no-cache',
          'x-requested-with': 'XMLHttpRequest'
        },
        body: `pageindex=${pageIndex}&pagesize=${pageSize}&ncata_id=&is_hot=N&max_id=99999641`,
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsResponse = await response.json();

      if (data.success === 'Y' && data.content) {
        return data.content;
      } else {
        throw new Error(`API error: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('获取快讯失败:', error);
      throw error;
    }
  }
}

export const newsService = new NewsService(); 