import { IUser, IUserWithOnline } from "@typings/db";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import fetcher from '@utils/fetcher';
import { CollapseButton } from "@components/DMList/styles";
import { NavLink } from "react-router-dom";
import useSocket from "@hooks/useSocket";


// interface Props {

//     /** 원래 Props로 받았는데 굳이 Props말고 SWR로 캐싱된거 받아도 된다고 해서 변경 */
//     userData?: IUser;
// }

const DMList: FC = () => {
    
    /** Router Parameter 현재 주소창에서 workspace 데이터를 받아온다*/
    const { workspace } = useParams<{workspace?: string}>();

    const { data: userData } = useSWR<IUser | undefined>(`/api/users`, fetcher, {
        dedupingInterval: 2000,
    });

    /** 
     * workspace데이터를 가지고 REST API호출해 워크스페이스에 등록된 회원데이터들을 가져온다 
     * VO(DTO) 같은 것들을 리스트형식으로 받는 타입 형식은 IUserWithOnlone[] 형태로 많이 쓰는것 같음!
    */
    const { data: memberData } = useSWR<IUserWithOnline[]>(

        userData? `/api/workspaces/${workspace}/members` : null,
        fetcher 
    )
    
    const [socket] = useSocket(workspace);

    /** 회원 목록을 나타내는 on/off 버튼 */
    const [channelCollapse, setChannelCollapse] = useState(false)

    /** 이거 어떤 타입인지 잘 모르겠네? */
    const [countList, setCountList] = useState<{[key: string]:number}>({})

    const [onlineList, setOnlineList] = useState<number[]>([])

    /** collapse 버튼 클릭 이벤트 */
    const toggleChannelCollapse = useCallback(()=> {
        setChannelCollapse((prev) => !prev)
    }, [])

    // const resetCount = useCallback(
    //     () => {

    // })

    useEffect(() => {
        console.log('DMList: workspace 바꼈다', workspace);
        setOnlineList([]);
      }, [workspace]);
    
      useEffect(() => {
        socket?.on('onlineList', (data: number[]) => {
          setOnlineList(data);
        });
        // socket?.on('dm', onMessage);
        // console.log('socket on dm', socket?.hasListeners('dm'), socket);
        return () => {
          // socket?.off('dm', onMessage);
          // console.log('socket off dm', socket?.hasListeners('dm'));
          socket?.off('onlineList');
        };
      }, [socket]);

    return (
        <>
        <h2>
            <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
            <i
                className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                data-qa="channel-section-collapse"
                aria-hidden="true"
            />
            </CollapseButton>
            <span>Direct Messages</span>
        </h2>
        <div>
            {!channelCollapse &&
            memberData?.map((member) => {
                const isOnline = onlineList.includes(member.id);
                const count = countList[member.id] || 0;
                return (
                <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                    <i
                    className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                        isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                    }`}
                    aria-hidden="true"
                    data-qa="presence_indicator"
                    data-qa-presence-self="false"
                    data-qa-presence-active="false"
                    data-qa-presence-dnd="false"
                    />
                    <span>{member.nickname}</span>
                    {member.id === userData?.id && <span> (나)</span>}
                </NavLink>
                );
            })}
        </div>
        </>
    )
}

export default DMList;