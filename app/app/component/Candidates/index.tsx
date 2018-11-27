import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';
import CandidatesProfile from './CandidateProfile';

const Wrapper = styled.div`
  flex: 1;
  text-align: center;
`;

@observer
class Candidates extends React.Component {
  public render() {
    return (
      <Wrapper>
        {voteService.candidatesList.map((it) => (
          <CandidatesProfile key={it} id={it} />
        ))}
      </Wrapper>
    );
  }
}

export default Candidates;
