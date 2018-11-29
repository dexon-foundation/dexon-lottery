import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  flex: 1;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`;
const DataArea = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0px;
`;

const Highlight = styled.div`
  color: violet;
  margin: 5px;
`;

@observer
class RefundHistory extends React.Component {
    public render() {
      return (
        <Wrapper>
          Refund History
          <DataArea>
            {voteService.refundHistory.map((it, key) => {
              return (
                <Row key={key}>
                  <Highlight>{it.name}</Highlight>
                  received
                  <Highlight>{voteService.deiToDex(it.amount)}</Highlight>
                  DEX
                </Row>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
}

export default RefundHistory;
