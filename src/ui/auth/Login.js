import React, { useState, useContext } from "react";
import styled from "styled-components";
import Metamask from "../../assets/metamask.png";
import Discord from "../../assets/discord-dark.png";
import configs from "../../configs";
import { withApi } from "../contexts/ApiContext";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalState";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 60px;
  flex-direction: column;
`;

const MetaButton = styled.div`
  background-color: ${props => props.primary};
  border: none;
  padding: 12px 40px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ButtonImage = styled.img`
  margin-right: 5px;
`;

const LinkA = styled.a`
  text-decoration: none;
  width: 100%;
`;

const ButtonLabel = styled.span`
  color: #ffffff;
`;
const LoginWithMeta = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const history = useHistory();
  const context = useContext(GlobalContext);

  const metaMaskLogin = async event => {
    event.preventDefault();
    event.stopPropagation();
    if (!loggingIn) {
      setLoggingIn(true);
      await context.metaMaskLogin();
      history.push("/projects");
    }
  };

  //Close model automatically
  // useEffect(() => {
  //     if (address && onCancel) {
  //         onCancel()
  //     }
  // }, [address])

  return (
    <Container>
      <MetaButton primary="#d4055a" onClick={metaMaskLogin}>
        <ButtonImage src={Metamask} alt="metamask" width="28px" />
        <ButtonLabel>MetaMask</ButtonLabel>
      </MetaButton>

      <LinkA href={configs.DISCORD_AUTHORIZATION_URL}>
        <MetaButton primary="#7289da">
          {" "}
          <ButtonImage src={Discord} alt="metamask" width="28px" />
          <ButtonLabel>Discord</ButtonLabel>
        </MetaButton>
      </LinkA>
    </Container>
  );
};

export default withApi(LoginWithMeta);
