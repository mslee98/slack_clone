import React, {useState, useCallback} from 'react';
import {Header, Form, Label, Input, Button, Error, LinkContainer} from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher'; //직접 구현

const Login = () => {

    /**
     * useSWR은 역할은 하나 "fetcher"로 주소를 전달해주는 역할
     * const {data} = useSWR('url', fetcher);
     * fetcher통해 받은 response data는 {data}에 담긴다.
     * 
     * data가 존재하지 않으면 로딩중
     * SWR만에 요청하는게 정해져있으며 커스텀도 가능 브라우저 탭 이동했다가 다시 오면 다시 요청하는 등
     * 
     */
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
            // revalidate();
            })
            .catch((error) => {
            setLogInError(error.response?.status === 401);
            });
        },
        [email, password],
    );
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