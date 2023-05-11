import { Link } from "react-router-dom";
import styled from "styled-components";

const NavButton = styled(Link)`
    ${props => props.btnStyle ? '' : `
        display: flex;
        flex-direction: column;
        font-weight: 500;
        font-size: 1.3rem;
        text-decoration: none;
        color: #ffffff;
        margin: auto 0;
        cursor: pointer;
    `}
`

const NavImg = styled.img`
    height: 2rem;
    width: auto;
    margin: 0 auto 0.8rem auto;
`

const NavBtn = (props) => {
    return (
        <NavButton to={props.link} className={props.btnStyle ? props.btnStyle : ''}>
           <NavImg className={props.iconColor} src={props.icon} alt="" />
           <span className={props.textStyle}>{props.name}</span>
        </NavButton>
    );
};

export default NavBtn;