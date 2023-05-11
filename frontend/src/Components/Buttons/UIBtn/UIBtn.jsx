import styles from "./UIBtn.module.css";
import styled from 'styled-components';

const ImgIcon = styled.img`
    height: 2rem;
    margin: auto auto auto 0.8rem;
`

const UIButton = styled.button`
    display: flex;
    min-width: 36vw;
    border: 0;
    border-radius: 1.6rem;
    color: #ffffff;
    padding: 1.2rem;
    @media only screen and (min-width: 1024px) {
        min-width: 20vw;
    }
`

const UIContainer = styled.div`
    justify-content: space-between;
    display: flex;
    margin: auto;
`

const Text = styled.span`
    font-weight: 500;
    font-size: 1.6rem;
    margin: auto 0 auto auto;
`

const UIBtn = (props) => {
    let icon;
    if (props.icon) {
        icon = <ImgIcon id="icon" className={props.iconColor} src={props.icon} alt="" />;
    } else {
        icon = null;
    }
    let btnType;
    if (props.btnType === "valid") {
        btnType = styles.valid;
    } else if (props.btnType === "cancel") {
        btnType = styles.cancel;
    } else if (props.btnType === "warning") {
        btnType = styles.warning;
    }

    return (
        <UIButton id={props.id} className={`${styles.btn} ${btnType} ${props.buttonClass}`} type={props.type} form={props.form} onClick={props.onClick}>
            <UIContainer className={styles.justify}>
                <Text className={styles.text}>{props.name}</Text>
                {icon}
            </UIContainer>
        </UIButton>
    )
};

export default UIBtn;