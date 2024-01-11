import axios from 'axios';

// url는 useSWR에서 보내는 주소값임
/**
 * 
 * Get, Post, Push, Delete 등 상관 없음
 * fetcherPush = () => { axios.push()} 이런식으로 바꿔주면 됨
 * 중요한 건 서버에 요청을 보내서 데이터를 받아오는 역할이 중요 
 * 
 * @param url 
 * @returns response.data
 */
const fetcher = <Data>(url: string) => 


    axios
    .get(url, {
        withCredentials: true
    })
    .then( (response) => response.data)
    .catch(() => console.log("sssssssss",url))


export default fetcher;