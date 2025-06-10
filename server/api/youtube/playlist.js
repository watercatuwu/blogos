import axios from 'axios';

export default defineEventHandler(async event => {
  const APIKEY = process.env.GCP_API_KEY;
  const query = getQuery(event)
  const playlistId = query.playlistId

  if (!APIKEY) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing API Key'
    });
  } 
  
  if (!playlistId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'MissingPlayList ID'
    });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId,
        maxResults: 50,
        key: APIKEY
      }
    });

    return response.data
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.response?.data?.error?.message || error.message || 'Unknown error'
    });
  }
})