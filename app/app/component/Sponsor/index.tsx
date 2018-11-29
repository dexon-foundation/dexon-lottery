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
  padding: 5px 0px;
`;
const Highlight = styled.div`
  color: violet;
  margin: 0px 5px;
`;
@observer
class Sponsor extends React.Component {
    public render() {
      return (
        <Wrapper>
          Sponsor History
          <DataArea>
            {voteService.sponsorHistory.map((it, key) => {
              return (
                <Row key={key}>
                  <Highlight>{it.name}</Highlight>
                  received
                  <Highlight>{voteService.deiToDex(it.amount)}</Highlight>
                  DEX
                  from <Highlight>{this.processId(it.sponsor)}</Highlight>
                </Row>
              );
            })}
          </DataArea>
        </Wrapper>
      );
    }
    private processId(id : string) : string {
      return `${id.substring(0, 15)}...`;
    }
}

export default Sponsor;
