import * as React from 'react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';
import logo from '@/assets/ic-logo.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ContractInput = styled.input`
  width: 500px;
  border: 1px solid white;
  border-radius: 10px;
  text-align: center;
  height: 25px;
  margin: 0px 20px;
`;
const Logo = styled.img`
  height: 40px;
`;
const Padding = styled.div`
  flex: 1;
`;

class InputArea extends React.Component {

    public render() {
        return (
          <Wrapper>
            <Logo src={logo} />
            <Padding />
            <ContractInput
              placeholder={'Please input contract address here'}
              onChange={this.addresOnChange}
            />
            <Padding />
          </Wrapper>
        );
    }

    private addresOnChange({ target }) {
      const { value } = target || { value: undefined };
      if (value) {
        voteService.contractInit(value);
      }
    }

}

export default InputArea;
