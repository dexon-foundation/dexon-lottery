import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import voteService from '@/service/voteHandler';

const Wrapper = styled.div`
  display: flex;
  margin: 10px 0px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  align-items: center;
`;
const StyledBtn = styled.button`
  margin: 0px 10px;
  padding: 5px 0px;
  color: violet;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid violet;
  border-radius: 10px;
  min-width: 100px;
  font-size: large;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  flex: 1;
`;
const Name = styled.div`
  font-size: large;
`;
const Padding = styled.div`
  flex: 1;
`;
const Vote = styled.div`
  display: flex;
`;
const CandidateNumber = styled.div`
  display: flex;
`;
const Address = styled.div`
  font-size: xx-small;
  color: gray;
`;

const Hint = styled.div`
  color: violet;
  margin-right: 5px;
  width: 80px;
`;

const ProfileImg = styled.img`
  height: 45px;
  border-radius: 100%;
  background-color: rgba(238, 130, 238, 0.7);
`;

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
            <ProfileImg src={`https://robohash.org/${id}`} />
            <TextArea>
              <Name>{profile.name}</Name>
              <Address>{this.processId(id)}</Address>
            </TextArea>
            <TextArea>
                <Vote>
                  <Hint>Votes: </Hint>
                  {profile.vote}
                </Vote>
                <CandidateNumber>
                  <Hint>Number:</Hint> {profile.candidateNumber}
                </CandidateNumber>
            </TextArea>

            <Padding />
            <StyledBtn
              onClick={() => {
                const amount = prompt(`How much DEX do you want to sponsor candidate ${profile.name}?`);
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
  private processId(id : string) : string {
    return `${id.substring(0, 20)}...`;
  }
}

export default CandidatesProfile;
