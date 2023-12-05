import React, {useState, SetStateAction, useCallback, Dispatch} from 'react';


type ReturnTypes<T = any> = [T, (e : any) => void, Dispatch<SetStateAction<T>>];
/**
 * useInput
 * @param initialData 
 * @returns 
 * 커스텀 훅 
 */
const useInput = <T = any>(initialData: T): ReturnTypes=> { 
    //const useInput = <T = any>(initialData: T): [T, (e : React.UIEvent<HTMLInputElement>) => void, Dispatch<setStateAction<T>>] => { 
    //이거 handler자리 타입 any 안 쓰러면 e : React.ChangeEvent<HTMLInputElement> 이렇게 써야 하는데 그러면 e.target.value도 못쓰고 e.currentTarget.value 이렇게 바꾸라고 에러나옴
    //유지하고 싶다면 e.target.value as unknown as T 로 변경
    
    const [value, setValue] = useState(initialData);

    const handler = useCallback((e) => {
        setValue(e.target.value);
    }, [])

    return [value, handler, setValue];

}

export default useInput;