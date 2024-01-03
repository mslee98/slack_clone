import React, {useState, useCallback} from 'react';
import { Form, Label, Input, LinkContainer, Button, Header, Error, Success} from './styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const SignUp = () => {

    const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

    const [email, onChangeEmail, setEmail] = useInput('');
    const [nickname, onChangeNickname, setNickame] = useInput('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [mismatchError, setMismatchError] = useState(false);
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        setMismatchError(e.target.value !== passwordCheck);
    }, [passwordCheck]);//이것도보면 passwordCheck가 변경되면 onChangePassword를 실행

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setMismatchError(e.target.value !== password);
    }, [password]);

    const onSubmit = useCallback((e) => {
        //SPA이기 때문에 가능하면 적어두는게 좋지
        e.preventDefault();

        if(!mismatchError) {
            console.log('서버로 회원가입하기');
            console.log(email, nickname, password, passwordCheck);

            setSignUpError('')// 비동기 중에 setState훅을 사용하는 경우 요청 전에 초기화 해주는게 좋다.
            setSignUpSuccess(false)// 만약 요청을 여러번 보낼 때 값이 달라질수 있음
            axios
                .post('/api/users', {
                    email,
                    nickname,
                    password,
                })
                .then((response) => {
                    console.log(response);
                    setSignUpSuccess(true)
                })
                .catch((error) => {
                    console.log(error.response);
                    setSignUpError(error.response.data);
                })
                .finally(() => {}) //Promise || try catch에서 새로 나온거 성공을 하든 실패를 하든 무조건적으로 실행
        }

    }, [email, nickname, password, passwordCheck]);


    /**
     * return 은 무조건 React hooks보다 아래에 위치해야한다.
     */
    if(data === undefined) {
        return <div>로딩중...</div>
    }

    if(data) {
        return <Redirect to={'/workspace/sleact/channel/일반'} />
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
                <Label id="nickname-label">
                <span>닉네임</span>
                <div>
                    <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
                </div>
                </Label>
                <Label id="password-label">
                <span>비밀번호</span>
                <div>
                    <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                </div>
                </Label>
                <Label id="password-check-label">
                <span>비밀번호 확인</span>
                <div>
                    <Input
                    type="password"
                    id="password-check"
                    name="password-check"
                    value={passwordCheck}
                    onChange={onChangePasswordCheck}
                    />
                </div>
                {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                {signUpError && <Error>{signUpError}</Error>}
                {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <Link to="/login">로그인 하러 가기</Link>
            </LinkContainer>
        </div>
    )
}

export default SignUp;