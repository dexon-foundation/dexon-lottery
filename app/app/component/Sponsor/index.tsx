import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  border: 1px solid gray;
`;
const DataArea = styled.div``;
@observer
class Sponsor extends React.Component {
    public render() {
      return (
        <Wrapper>
          Sponsor History
          <DataArea>
            {voteService.sponsorHistory.map((it, key) => {
              return (
                <div key={key}>
                  round: {it.round} -
                  candidate: {it.name} -
                  amount: {it.amount} -
                  from: {it.sponsor}
                </div>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
}

export default Sponsor;
