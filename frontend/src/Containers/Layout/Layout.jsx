import { useWindowDimension } from "../../Hooks/windowHook";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Nav from "../../Components/Nav/Nav";
import Menu from "../Menu/Menu";

const HomeWrapper = styled.main`
    display: flex;
    flex-direction: column;
    height: 88vh;
    background-color: white;
    border-radius: 0 0 5rem 5rem;
`

const DesktopWrap = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 1200px;
    margin: 0 auto;
`

const Wrapper = styled.main`
    display: flex;
    flex-direction: column;
    height: 88vh;
    background-color: white;
    border-radius: 0 0 5rem 5rem;
    @media only screen and (min-width: 1024px) {
        width: 60%;
        margin: 0 3.2rem;
        border-radius: 0;
        height: 93vh;
    }
`
const Disclaimer = styled.p`
    color: #ffd7d7;
    font-size: 1.3rem;
    margin: 2rem;
    text-align: center;
`

const Layout = (props) => {
    const { width } = useWindowDimension();
    const path = useLocation().pathname;

    const mobileLayout = (
        <>
            <HomeWrapper>{props.children}</HomeWrapper>
            <Nav />
        </>
    );

    const desktopLayout = (
        <>
            <DesktopWrap>
                <Menu />
                <Wrapper>{props.children}</Wrapper>
            </DesktopWrap>
            <Disclaimer className="disclaimer">
                Groupomania 2022! En aucun cas, la société ne pourra être tenue pour responsable du comportement de ses employés sur ce site!
            </Disclaimer>
        </>
    );

    if (width <= 1023) {
        return mobileLayout;
    }

    if (width >= 1024) {
        switch (path) {
            case "/":
                return mobileLayout;
            case "/login":
                return mobileLayout;
            case "/signup":
                return mobileLayout;
            default:
                return desktopLayout;
        }
    }
};

export default Layout;