import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { VFC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';


interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal : VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {

    const [newChannel, onChanageNewWorkspace, setNewChannel] = useInput('');
    const [newWorkspace, setNewWorkspace] = useInput('');
    const {workspace, channel} = useParams<{workspace: string, channel: string}>();

    const { data: userData, error, revalidate } = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval: 2000, // 2초
      });
    const { data: channerData, mutate, revalidate: revalidateChannel } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels`: null, fetcher)

    const onCreateChannel = useCallback(
        (e) => {
          e.preventDefault();

          axios
            .post(
              `/api/workspaces/${workspace}/channels`,
              {
                name: newChannel,
              },
              {
                withCredentials: true,
              },
            )
            .then((response) => {
                setShowCreateChannelModal(false);
                revalidateChannel();
                setNewChannel('');
            })
            .catch((error) => {
              console.dir(error);
              toast.error(error.response?.data, { position: 'bottom-center' });
            });
        },
        [newChannel],
      );

    if(!show) {
        return null;
    }

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id='workspace' value={newChannel} onChange={onChanageNewWorkspace} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
}

export default CreateChannelModal;