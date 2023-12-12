import React from 'react';

/** 코드 스플릿팅을 위한 라이브버리
 * loadable을 사용하면 알아서 스플릿팅하고 알아서 불러온다.
 */
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// import Login from '@pages/Login';
// import SignUp from '@pages/SignUp';
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
// const Channel = loadable(() => import('@pages/Channel'));
// const DirectMessage = loadable(() => import('@pages/DirectMessage'))
const Workspace = loadable(() => import("@layouts/Workspace"));

const App = () => {

    return (
        /**
         * Switch 말 그대로 하나만 킬수 있도록 하는 React-router이다.
         * url주소가 login이라면 Login 컴포넌트만 혹은 signup이라면 SignUp컴포넌트를 보여주며
         * url주소가 "/" 이런식으로 오면 Login 페이지를 올 수 있게끔 해줌
         */
        <Switch>
            <Redirect exact path="/" to="/Login"/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/workspace" component={Workspace} />
            {/* <Route path="/workspace/channel" component={Channel}/>
            <Route path="/workspace/dm" component={DirectMessage}/> */}
        </Switch>
    )
}

export default App;