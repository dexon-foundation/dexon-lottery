import * as React from 'react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  text-align: center;
`;
const ContractInput = styled.input`
  width: 500px;
`;

class InputArea extends React.Component {

    public render() {
        return (
          <Wrapper>
            <ContractInput
              placeholder={'Please input contract address here'}
              onChange={this.addresOnChange}
            />
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
