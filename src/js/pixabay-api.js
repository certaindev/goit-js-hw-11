import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32919842-6fac75211768a54d843abbd7a';

  constructor(query, perPage, page) {
    this.query = query;
    this.perPage = perPage;
    this.page = page;
  }

  async fetchImages() {
    const params = {
      key: PixabayAPI.API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: this.perPage,
      page: this.page,
    };

    const res = await axios.get(`${PixabayAPI.BASE_URL}`, { params: params });
    return await res.data;
  }
}
