import React, {useState, useCallback} from 'react';
import {Header, Form, Label, Input, Button, Error, LinkContainer} from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher'; //직접 구현

const Login = () => {

    /**
     * useSWR은 역할은 하나 "fetcher"로 주소를 전달해주는 역할이며, url은 key라고 생각하면 된다. 
     * const {data} = useSWR('url', fetcher);
     * fetcher통해 받은 response data는 {data}에 담긴다.
     * 
     * data가 존재하지 않으면 로딩중
     * SWR만에 요청하는게 정해져있으며 커스텀도 가능 브라우저 탭 이동했다가 다시 오면 다시 요청하는 등
     * 
     * revalidate()는 서버에게 요청해서 data를 받아옴
     * mutate는 서버에게 요청없이 데이터를 변경, 즉 기존에 가지고 있던 data 변경
     * 
     * mutate는 useSWR() 내에서도 사용할 수 있고, 
     * import useSWR, { mutate } from 'swr'; 에도 존재하는데, 이거는 조금 더 범용적으로 사용할 수 있다고 함
     * 대신 사용법은 mutate('호출 url', false); 이런식으로 사용한다.
     * 
     * 전역 mutate가 유용한 점은
     * 지금은 로그인하고 workspace/channel로 이동할 때 최소 한번은 useSWR을 호출하며 서버에게 요청을 보낸다.
     * 이 한번조차 아깝다면 axios.post().then( () => mutate('url 주소', false, false))로 바꾸면 됨
     * 
     * SWR 기능은 GraphQL이라면 아폴로, SWR경쟁자인 React Query로 이 기능을 다 제공
     * 
     * SWR은 비동기에만 사용하는것은 아니다.
     * const { data } = useSWR('hello', (key) => {localStorage.setItem('data', key) return localStorage.getItem('data')} )
     * 위에처럼 SWR로 localStorage를 관리할 수 있다.
     * 
     * 만약 같은 서로 다른 fetcher로 다른 요청을 보내고 싶을 때 꼼수로
     * const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);
     * const { data, error, revalidate, mutate } = useSWR('/api/users#123', fetcher2); // #이나 ?같은 쿼리 스트링사용하면 된다.
     * 서버쪽에서는 "?", "#" 관련된것들은 빼버리긴하는데 url 주소가 달라 다르게 데이터를 저장할 수 있다.
     * 
     * 
     */

    // const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher, {
    //   dedupingInterval: 2000, // 서버에 2000(2초) 주기로 요청, 같은 요청이 여러번일 때 2초안에 실행된것들은 캐시에서 가져옴
    //   focusThrottleInterval: 5000, // revalidate도 5000(5초)에 한 번씩
    //   errorRetryInterval: 5000, // 서버 요청 시 에러가 있다면 5초 뒤에 재요청
    //   loadingTimeout: 3000, // 요청 시 3초가 넘어가면
    //   errorRetryCount: 5 // 몇번 까지 재요청을 할지
    //   // 이외 다양한 옵션이 많으니 공식 문서를 참고하는게 더 좋을듯! 
    // });


    const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');

    const onSubmit = useCallback(
        (e) => {
        e.preventDefault();
        setLogInError(false);


        /** 프론트 서버와 백엔드 서버간 도메인이 다르면 쿠키를 전달하거나 받을 수 가 없다.
         * 그래서 사용해주는 옵션이 아래 "withCredentiials: true" 임
         * axios기준 get요청에서 자리는 2번째, Post요청에서 자리는 3번쨰 위치함
         */
        axios
            .post(
            '/api/users/login',
            { email, password },
            {
                withCredentials: true,
            },
            )
            .then((response) => {
              console.log("###############로그인 성공")
              // revalidate(); 지금 이렇게 보면 위에서 axios로 post 요청을 보내고 성공 시 revelidate()로 재요청을 하는데 불필요함
              mutate(response.data, false);//뒤에 false는 shouldRevalidate인데 데이터를 변경하고 서버에 점검하면서 요청을 보낸다고 함 끄러면 false
              // 이게 생각보다 엄청 유용한 기능임
              // 인스타 하트, 페이스북 좋아요 등 생각해보면 서버 요청하고 색이 변경해야 되는건데 지금보면 즉시 반영이 된다.
              // 이게 바로 mutate 기능이라고 하며 "OPTIMISTIC UI"라고도 함, 직역하면 낙관적인 UI인데 요청이 무조건적으로 성공할것으로보고 즉시 반영하는걸 말한다.
              // 대신 shouldRevelidate가 true임
            })
            .catch((error) => {
            setLogInError(error.response?.status === 401);
            });
        },
        [email, password],
    );

      
    /**
     * 이 때 data는 SWR 데이터임
     */
    if(data === undefined) {
      return <div>로딩중...</div>
    }

    if(data) {
      return <Redirect to={'/workspace/channel'} />
    }

    return (
        <div id="container">
          <Header>Sleact</Header>
          <Form onSubmit={onSubmit}>
            <Label id="email-label">
              <span>이메일 주소</span>
              <div>
                <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
              </div>
            </Label>
            <Label id="password-label">
              <span>비밀번호</span>
              <div>
                <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
              </div>
              {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
            </Label>
            <Button type="submit">로그인</Button>
          </Form>
          <LinkContainer>
            아직 회원이 아니신가요?&nbsp;
            <Link to="/signup">회원가입 하러가기</Link>
          </LinkContainer>
        </div>
      );
}

export default Login;