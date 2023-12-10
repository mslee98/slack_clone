import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
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

/**
 * 
 * children은 Channel 컴포넌트 div 태그같은것들임
 * Workspace는 Layout 컴포넌트로 children 페이지 엘리먼트들을 Props로 받고
 * FC는 React 타입으로 children을 포함되어 있으며, children을 안쓰는 React 타입을 쓸거면 VFC를 사
 */
const Workspace : FC = ({children}) => {

    const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

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
    if(data === undefined) {
       return <div>로딩중...</div>
    }

    if(!data) {
        return <Redirect to={'/login'} />
    }

    return (
        <div>
          <Header>
            <RightMenu>
                    <span>
                        <ProfileImg src={gravatar.url(data.nickname, {s: '28px', d: 'retro'})} alt={data.email}/>
                    </span>
            </RightMenu>
          </Header>
          <WorkspaceWrapper>
            {/* <Workspace>Workspace</Workspace> */}
            <Channels>
                <WorkspaceName>sLeact</WorkspaceName>
                <MenuScroll>menu scroll</MenuScroll>
            </Channels>
            <Chats>Chats</Chats>
          </WorkspaceWrapper>
        </div>
      );
}

export default Workspace;