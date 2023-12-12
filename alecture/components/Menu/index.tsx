import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';
import { CloseButton } from 'react-toastify/dist/components';


interface Props {
    show: boolean;
    onCloseModal: () => void;
    style: CSSProperties;
    closeButton?: boolean; // ?있을수도 없을수도 있다는 뜻
}
const Menu : FC<Props> = ({children, style, show, onCloseModal, closeButton}) => {
    
    /**
     * 부모를 클릭했을 때 모달이 닫히게
     * 나 자신(모달 내부 영역)을 클릭했을 때 안닫히게
     * 이벤트 버블링으로 인해 생기는 오류를 제거함.
     * 즉, 부모 요소한테 이벤트 전달이 안
     */
    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, []);
    
    return (
        /**
         * CreateMenu 부모 영역(모달 바깥 영역)을 클릭했을 때 닫게
         */
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}  
            </div>
            {/* <div onClick={stopPropagation} style={style}>menu</div> */}
        </CreateMenu>
    )
}

/**
 * 만약 @types/props를 사용하고 싶다면 아래처럼 
 * 그렇지 않고 typescript를 사용하겠다면 위에처럼 interface정의해서 사용하면 됨
 */
// Menu.propTypes = {

// }

/**
 * Props에 기본값을 설정할 때
 */
Menu.defaultProps =  {
    closeButton: true,
}

export default Menu;