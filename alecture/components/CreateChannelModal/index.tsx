import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import React, { VFC, useCallback, useState } from 'react';


interface Props {
    show: boolean;
    onCloseModal: () => void;
}

const CreateChannelModal : VFC<Props> = ({show, onCloseModal}) => {

    const [newChannel, onChanageNewWorkspace] = useInput('');
    const [newWorkspace, setNewWorkspace] = useInput('');

    const onCreateChennel = useCallback(() => {

    }, []);

    if(!show) {
        return null;
    }

    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChennel}>
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