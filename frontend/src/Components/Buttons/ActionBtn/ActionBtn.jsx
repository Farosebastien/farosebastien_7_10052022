import styled from "styled-components";

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    font-weight: 500;
    font-size: 1.3rem;
    text-decoration: none;
    color: #ffffff;
    margin: auto 0;
    cursor: pointer;
    background-color: transparent;
    border: 0;
`

const ActionImg = styled.img`
    height: 2rem;
    width: auto;
    margin: 0 auto 0.8rem auto;
`

const ActionBtn = (props) => {
    return (
        <ActionButton id={props.id} form={props.form} type={props.type} onClick={props.onClick}>
            <ActionImg className={`${props.iconColor}`} src={props.icon} alt="" />
            {props.name}
        </ActionButton>
    );
};

export default ActionBtn;