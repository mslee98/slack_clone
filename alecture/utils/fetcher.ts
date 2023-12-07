import axios from 'axios';

// url는 useSWR에서 보내는 주소값임
const fetcher = (url: string) => 
    axios
        .get(url, {
            withCredentials: true
        })
        .then( (response) => response.data)

export default fetcher;