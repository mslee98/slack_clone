import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { VFC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';


interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal : VFC<Props> = ({show, onCloseModal, setShowInviteChannelModal}) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { data: userData } = useSWR<IUser>('/api/users', fetcher);

  const { revalidate: revalidateMember } = useSWR<IChannel[]>(
    userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        })
        .then((response) => {
          revalidateMember();
          setShowInviteChannelModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember],
  );

    if(!show) {
        return null;
    }

    return (
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
    )
}

export default InviteChannelModal;