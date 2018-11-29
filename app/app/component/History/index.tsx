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
  overflow-y: auto;
`;
const Row = styled.div`
  display: flex;
  margin: 5px 0px;
`;
const Highlight = styled.div`
  color: violet;
  margin: 0px 5px;
`;
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
                <Row key={it}>
                  [{it}] <Highlight>{name}</Highlight>
                  was elected by <Highlight>{vote}</Highlight> votes
                </Row>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
}

export default History;
