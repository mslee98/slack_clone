import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import {
    AddButton,
    Channels,
    Chats,
    Header,
    LogOutButton,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceButton,
    WorkspaceModal,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper,
  } from '@layouts/Workspace/styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';


const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'))

/**
 * 
 * children은 Channel 컴포넌트 div 태그같은것들임
 * Workspace는 Layout 컴포넌트로 children 페이지 엘리먼트들을 Props로 받고
 * FC는 React 타입으로 children을 포함되어 있으며, children을 안쓰는 React 타입을 쓸거면 VFC를 사
 */
const Workspace : FC = ({children}) => {


   /**
    * 보면 useSWR<IUser | false> / IUser 는 /alecture/typings/db.ts로 DB별 타입이 정의된 파일임
    * 제네릭으로 IUser를 적어주면 되는데 문제는 로그인 정보가 없을 때는 false로 mutate(false)이 부분에서 에러가 나기 때문에
    * <IUser | false>로 정의함
    */
    const { data : userData, error, revalidate, mutate } = useSWR<IUser | false>('/api/users', fetcher);
    /**
     * 아래 data: userData 이런식으로 변수 개명할수도 있음
     */
    // const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);

    const [showUserMenu, setShowUserMenu] = useState(false);

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true // 쿠키 공유
        })
        .then(() => {
            mutate(false);  
        });
    }, [])


    /**
     * 아래도 !data로 하면 괜찮을 줄 알았는데, data 초기값은 false임 그래서 상세하게 명시해줘야한다.
     */
    if(userData === undefined) {
       return <div>로딩중...</div>
    }

    if(!userData) {
        return <Redirect to={'/login'} />
    }


    const onClickUserProfile = useCallback(() => {
      setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {

    }, [])

    return (
        <div>
          <Header>
            <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname, {s: '28px', d: 'retro'})} alt={userData.email}/>
                        {showUserMenu && (
                          // Menu 컴포넌트에게 props로 전달
                          <Menu style={{right:0, top: 38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                              <img src={gravatar.url(userData.nickname, {s: '36px', d: 'retro'})} alt={userData.email} />
                              <div>
                                <span id='profile-name'>{userData.nickname}</span>
                                <span id='profile-active'>Active</span>
                              </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                          </Menu>
                        )}
                    </span>
            </RightMenu>
          </Header>
          <WorkspaceWrapper>
            <Workspaces>
              {userData?.Workspaces.map((ws) => {
                return (
                  <Link key={ws.id} to={'/workspace/${}/channel/일반'}>
                    <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                  </Link>
                )
              })}
              <AddButton onClick={onClickCreateWorkspace}></AddButton>
            </Workspaces>
            <Channels>
                <WorkspaceName>sLeact</WorkspaceName>
                <MenuScroll>menu scroll</MenuScroll>
            </Channels>
            <Chats>
              <Switch>
                <Route path="/workspace/channel" component={Channel} />
                <Route path="/workspace/dm" component={DirectMessage} />
              </Switch>
            </Chats>
          </WorkspaceWrapper>
        </div>
      );
}

export default Workspace;