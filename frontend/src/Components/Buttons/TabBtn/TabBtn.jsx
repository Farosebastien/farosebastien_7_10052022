import styled from 'styled-components';

const TabButtonActive = styled.button`
    background-color: white;
    font-size: 1.49rem;
    font-weight: 500;
    width: 50%;
    padding: 0;
    border: 0;
`

const TabButton = styled.button`
    background-color: #ffd7d7;
    font-size: 1.49rem;
    font-weight: 500;
    width: 50%;
    padding: 0;
    border: 0;
`

const TabContainerActive = styled.div`
    display: flex;
    height: 4.7rem;
    border-bottom: 2px solid #fd2d01;
    margin: auto 1.6rem;
    cursor: pointer;
`

const TabContainer = styled.div`
    display: flex;
    height: 4.7rem;
    margin: auto;
    cursor: pointer;
`

const ImgIconActive = styled.img`
    filter: invert(27%) sepia(87%) saturate(5156%) hue-rotate(5deg) brightness(102%) contrast(105%);
    height: 2rem;
    margin: 1.2rem auto auto 1rem;
`

const ImgIcon = styled.img`
    filter: invert(55%) sepia(13%) saturate(0%) hue-rotate(286deg) brightness(90%) contrast(94%);
    height: 2rem;
    margin: 1.2rem auto auto 1rem;
`

const TextActive = styled.span`
    color: #fd2d01;
    margin: 1.5rem 0 auto auto;
`

const Text = styled.span`
    color: #6f6f6f;
    margin: 1.5rem 0 auto auto;
`

const TabBtn = (props) => {
    let btn;

    if (props.active === "active") {
        btn = (
            <TabButtonActive onClick={props.onClick}>
                <TabContainerActive>
                    <TextActive>{props.name}</TextActive>
                    <ImgIconActive src={props.icon} alt="" />
                </TabContainerActive>
            </TabButtonActive>
        );
    } else {
        btn = (
            <TabButton onClick={props.onClick}>
                <TabContainer>
                    <Text>{props.name}</Text>
                    <ImgIcon src={props.icon} alt="" />
                </TabContainer>
            </TabButton>
        );
    }

    return <>{btn}</>;
};

export default TabBtn;