import axios from 'axios';

export const FETCH_NEWS_REQUEST = 'FETCH_NEWS_REQUEST';
export const FETCH_NEWS_SUCCESS = 'FETCH_NEWS_SUCCESS';
export const FETCH_NEWS_FAILURE = 'FETCH_NEWS_FAILURE';

export const fetchNewsRequest = () => ({
  type: FETCH_NEWS_REQUEST,
});

export const fetchNewsSuccess = (news) => ({
  type: FETCH_NEWS_SUCCESS,
  payload: news,
});

export const fetchNewsFailure = (error) => ({
  type: FETCH_NEWS_FAILURE,
  payload: error,
});

export const fetchNews = () => {
  return async (dispatch) => {
    dispatch(fetchNewsRequest());
    try {
      const response = await axios.get('https://hacker-news.firebaseio.com/v0/askstories.json'); // тут можно topstories поставить. Только не на всех постах будут тексты. (в основном только тайтлы)
      const storyIds = response.data.slice(0, 10); 
      const storyRequests = storyIds.map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const stories = await Promise.all(storyRequests);
      dispatch(fetchNewsSuccess(stories.map(story => story.data)));
    } catch (error) {
      dispatch(fetchNewsFailure(error.message));
    }
  };
};
