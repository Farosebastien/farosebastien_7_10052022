import styled from "styled-components";
import { ldsDualRing } from "../../Utils/Keyframes";

const LoaderContainer = styled.div`
    ${props => props.asOverlay ? '' : `
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
    `}
`

const LoaderObject = styled.div`
    display: inline-block;
    width: 64px;
    height: 64px;
    &:after {
        content: " ";
        display: block;
        width: 46px;
        height: 46px;
        margin: 1px;
        border-radius: 50%;
        border: 5px solid #fd2d01;
        border-color: #fd2d01 transparent #fd2d01 transparent;
        animation: ${ldsDualRing} 1.2s linear infinite;
    }

`

const LoadingSpinner = (props) => {
    return (
        <LoaderContainer className={props.asOverlay ? props.asOverlay : ''}>
            <LoaderObject></LoaderObject>
        </LoaderContainer>
    );
};

export default LoadingSpinner;