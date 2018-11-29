import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  text-align: center;
  display: flex;
`;
const StyledBtn = styled.button``;
const NameArea = styled.div`
  display: flex;
  flex-direction: column;
`;
const Name = styled.div`

`;
const Padding = styled.div`
  flex: 1;
`;
const CandidateNumber = styled.div``;

interface Props {
  id : string;
}

@observer
class CandidatesProfile extends React.Component<Props> {
  public render() {
    const { id } = this.props;
    const profile = voteService.candidateData[id];
    // console.log(profile);
    return (
      <Wrapper>
        {profile && (
          <>
            <CandidateNumber>
              {profile.candidateNumber}
            </CandidateNumber>
            <NameArea>
              <Name>{profile.name}</Name>
              {id}
            </NameArea>
            {profile.vote}
            <Padding />
            <StyledBtn
              onClick={() => {
                const amount = prompt('How much do u want to sponsor?');
                voteService.sponsorCandidate(id, amount);
              }}
            >
              Sponsor
            </StyledBtn>
            <StyledBtn
              onClick={() => {
                voteService.vote(id);
              }}
            >
              Vote
            </StyledBtn>
          </>
        )}
      </Wrapper>
    );
  }
}

export default CandidatesProfile;
