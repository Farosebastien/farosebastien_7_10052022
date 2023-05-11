import styled from "styled-components";
import logo from "../../images/logo.png";
import backgroundImg from "../../images/home_background_groupomania.jpg"

const BackgroundImgContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 88vh;
    padding: 0 4rem;
    background: rgb(0, 0, 0) url(${backgroundImg}) center no-repeat;
    background-size: cover;
    resize: both;
    border-radius: 0 0 5rem 5rem;
    @media only screen and (min-width: 768px) {
        padding: 0 28%;
    }
`

const LogoImg = styled.img`
    margin: 17vh auto 0 auto;
    width: 125px;
    z-index: 10;
    filter: invert(28%) sepia(100%) saturate(3837%) hue-rotate(360deg) brightness(96%) contrast(108%);
    @media only screen and (min-width: 768px) {
        margin: 18vh auto 0 auto;
        width: 160px;
    }
`

const WelcomeContainer = styled.div`
    margin: 24vh auto 0 auto;
    width: 210px;
    color: #fd2d01;
    text-align: center;
    @media only screen and (min-width: 768px) {
        margin: 21vh auto 0 auto;
        width: 235px;
    }
`

const WelcomeTitle = styled.h3`
    font-size: 2.6rem;
    text-align: center;
    margin: 0;
    text-shadow: 0px 3px 5px rgba(0, 0, 0, 1);
    @media only screen and (min-width: 768px) {
        font-size: 3rem;
    }
`

const WelcomeMsg = styled.p`
    font-size: 1.4rem;
    margin: 0;
    text-shadow: 0px 3px 5px rgba(0, 0, 0, 1);
    @media only screen and (min-width: 768px) {
        font-size: 1.6rem;
        font-weight: 500;
    }
`

const Home = () => {
    return (
        <BackgroundImgContainer>
            <LogoImg src={logo} alt="Logo de Groupomania" />
            <WelcomeContainer>
                <WelcomeTitle>Bienvenue</WelcomeTitle>
                <WelcomeMsg>sur le réseau social interne !!</WelcomeMsg>
            </WelcomeContainer>
        </BackgroundImgContainer>
    );
};

export default Home;