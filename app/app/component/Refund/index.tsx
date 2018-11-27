import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  border: 1px solid gray;
`;
const DataArea = styled.div``;

@observer
class RefundHistory extends React.Component {
    public render() {
      return (
        <Wrapper>
          Refund History
          <DataArea>
            {voteService.refundHistory.map((it, key) => {
              return (
                <div key={key}>
                  round: {it.round} -
                  candidate: {it.name} -
                  amount: {it.amount}
                </div>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
}

export default RefundHistory;
