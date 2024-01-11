import { CollapseButton } from '@components/ChannelList/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

// interface Props {
//     userData?: IUser; 
// }

const ChannelList: FC = () => {
    
    const { workspace } = useParams<{workspace?: string}>();
    const location = useLocation();

    const {data: userData} = useSWR(`/api/users`, fetcher, {
        dedupingInterval: 2000,
    })

    const { data: channelData } = useSWR<IChannel[]>(
        userData? `/api/workspaces/${workspace}/channels` : null,
        fetcher
    )

    const [channelCollapse, setChannelCollapse] = useState(false)
    const [countList, setCountList] = useState<{[key: string]:number}>({})

    /** collapse 버튼 클릭 이벤트 */
    const toggleChannelCollapse = useCallback(()=> {
        setChannelCollapse((prev) => !prev)
    }, [])

    
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
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                activeClassName="selected"
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
    )
}

export default ChannelList;