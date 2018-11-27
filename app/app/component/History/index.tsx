import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  border: 1px solid gray;
`;
const DataArea = styled.div``;
@observer
class History extends React.Component {
    public render() {
      const rounds = Object.keys(voteService.electedPerson);
      console.log(rounds);
      return (
        <Wrapper>
          Election History
          <DataArea>
            {rounds.map((it) => {
              const data = voteService.electedPerson[it];
              const { name, vote } = data;
              return (
                <div key={it}>
                  [{it}] {name} - {vote}
                </div>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
}

export default History;
