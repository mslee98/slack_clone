import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { VFC, useCallback, useEffect, useReducer, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
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
import { IChannel, IUser } from '@typings/db';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import DMList from '@components/DMList';
import ChannelList from '@components/ChannelList';
import useScoket from '@hooks/useSocket';


const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'))
const Modal = loadable(() => import('@components/Modal'))

/**
 * 
 * children은 Channel 컴포넌트 div 태그같은것들임
 * Workspace는 Layout 컴포넌트로 children 페이지 엘리먼트들을 Props로 받고
 * FC는 React 타입으로 children을 포함되어 있으며, children을 안쓰는 React 타입을 쓸거면 VFC를 사
 */
const Workspace : VFC = () => {

  const {workspace} = useParams<{workspace: string}>()
  /**
   * 보면 useSWR<IUser | false> / IUser 는 /alecture/typings/db.ts로 DB별 타입이 정의된 파일임
   * 제네릭으로 IUser를 적어주면 되는데 문제는 로그인 정보가 없을 때는 false로 mutate(false)이 부분에서 에러가 나기 때문에
    * <IUser | false>로 정의함
    * 
    * useSWR 버전 업그레이드 인해 revalidate => mutate()로 변경되었다고 함..
  */
    const { data : userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
    /**
     * 아래 data: userData 이런식으로 변수 개명할수도 있음
    */
   // const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);
    
   
   const { data: channelData } = useSWR<IChannel[]>(
      userData? `/api/workspaces/${workspace}/channels`: null, 
      fetcher
    );

    const { data: memberData } = useSWR<IChannel[]>(
      userData? `/api/workspaces/${workspace}/member`: null, 
      fetcher
    );

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const [socket, disconnect] = useScoket(workspace);


    // socket connect
    useEffect(() => {
      if(channelData && userData && socket) {
        socket.emit('login', {
          id: userData.id,
          channels: channelData.map((v) => v.id),
        })

      }
    }, [channelData, userData, socket])

    //socket disconnect - 워크스페이스가 변경될 때
    useEffect(() => {
      return () => {
        disconnect();
      }
    }, [workspace, disconnect])

    const onLogout = useCallback(() => {
        axios.post('/api/users/logout', null, {
            withCredentials: true // 쿠키 공유
        })
        .then(() => {
            mutate(false, false);  
        });
    }, [])

    const onClickUserProfile = useCallback((e) => {
      e.stopPropagation();

      setShowUserMenu((prev) => !prev);
    }, []);
    
    const onCloseUserProfile = useCallback(() => {
      setShowUserMenu(false);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
      setShowCreateWorkspaceModal(true);
    }, [])
    
    const onCreateWorkspace = useCallback((e) => {
      /** React에서는 항상 Form submit진행할 때 새로고침 안되게 막아주는게 좋다 */
      e.preventDefault();
      /** 보통 Validation체크할 때 !newWorkspace만 한다면 띄어쓰기 한칸도 인식해버리 때문에
       * newWorkspacae.trim() 까지해야 막을 수 있다
      */
     if(!newWorkspace || !newWorkspace.trim()) {
       return;
      }
      
      if(!newUrl || !newUrl.trim()) {
        return;
      }
      
      axios.post('/api/workspaces', {
        workspace: newWorkspace,
        url: newUrl
      },{
        //이게 있어야 만 내가 로그인 한 상태라고 서버가 알 수 있다고 함
        withCredentials: true
      })
        .then((response) => {
          mutate(response.data, false);
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('')
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' })
        });
    }, [newWorkspace, newUrl])
    
    /**
     * 화면에 띄어져 있는 모든 모달을 닫는 메서드
     */
    const onCloseModal = useCallback(() => {
      setShowCreateWorkspaceModal(false);
      setShowCreateChannelModal(false);
      setShowInviteWorkspaceModal(false)
      setShowInviteChannelModal(false)
    }, [])
    
    const onClickAddChannel = useCallback(() => {
      setShowCreateChannelModal(true)
    }, [])

    const toggleWorkspaceModal = useCallback(() => {
      setShowWorkspaceModal((prev) => !prev);
    },[]);

    const onClickInviteWorkspace = useCallback(() => {
      setShowInviteWorkspaceModal(true)
      
    }, [])



    
    /**
     * 아래도 !data로 하면 괜찮을 줄 알았는데, data 초기값은 false임 그래서 상세하게 명시해줘야한다.
     */
    if (!userData) {
      return <Redirect to="/login" />;
    }

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
              {userData?.Workspaces?.map((ws) => {
                return (
                  <Link key={ws.id} to={`/workspace/${userData.Workspaces}/channel/일반`}>
                    <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                  </Link>
                )
              })}
              <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
            </Workspaces>
            <Channels>
                <WorkspaceName onClick={toggleWorkspaceModal}>sleact</WorkspaceName>
                <MenuScroll>
                  <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{top: 95, left: 80}}>
                    <WorkspaceModal>
                      <h2>Sleact</h2>
                      <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                      <button onClick={onClickAddChannel}>채널 만들기</button>
                      <button onClick={onLogout}>로그아웃</button>
                    </WorkspaceModal>
                  </Menu>
                  <ChannelList />
                  <DMList />
                  {/* {channerData?.map((v) => (<div>{v.name}</div>) )} */}
                </MenuScroll>
            </Channels>
            <Chats>
              <Switch>
                <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
                <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
              </Switch>
            </Chats>
          </WorkspaceWrapper>
          <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateWorkspace}>
              <Label id="workspace-label">
                <span>워크스페이스 이름</span>
                <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}></Input>
              </Label>
              <Label id="workspace-url-label">
                <span>워크스페이스 URL</span>
                <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}></Input>
              </Label>
              <Button type="submit">생성하기</Button>
            </form>
          </Modal>
          <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal} setShowCreateChannelModal={setShowCreateChannelModal} />
          <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}/>
          <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal}/>
        </div>
      );
}

export default Workspace;