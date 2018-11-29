import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import voteService from '@/service/voteHandler';
import Loading from '@/component/Loading';
import InputArea from '@/component/InputArea';
import Candidates from '@/component/Candidates';
import History from '@/component/History';
import Spnosor from '@/component/Sponsor';
import Refund from '@/component/Refund';

// const Test = Loadable({
//     loader: () => import(/* webpackChunkName: "Header" */ '@/component/Header'),
//     loading: Loading
// });

const StyledBtn = styled.button`
    background-color: black;
    color: violet;
    border: none;
    text-align: center;
    width: 100px;
    cursor: pointer;
    &:hover {
        font-weight: bold;
    }
`;
const Row = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
`;
const MainArea = styled.div`
    flex: 1;
    display: flex;
    margin-top: 20px;
`;
const HistoryArea = styled.div`
    display: flex;
    flex-direction: column;
    width: 500px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
`;
const Padding = styled.div`
    flex: 1;
`;
const State = styled.div`
    padding: 5px 20px;
    text-align: right;
`;
const Keyword = styled.span`
    font-weight: bold;
    color: violet;
`;

@observer
class Main extends React.Component {
    public render() {
        return (
            <>
                {!voteService.initDone && (
                    <div>Init......</div>
                )}
                {voteService.initDone && (
                    <>

                        <>
                            <Row>
                                <InputArea />
                                <Padding />
                                <StyledBtn
                                    onClick={() => {
                                        voteService.startVoting();
                                    }}
                                >
                                    Start Voting
                                </StyledBtn>
                                <StyledBtn
                                    onClick={() => {
                                        voteService.resetElection();
                                    }}
                                >
                                    Stop Voting
                                </StyledBtn>
                                <StyledBtn
                                    onClick={() => {
                                        const name = prompt('what is your name?');
                                        voteService.register(name);
                                    }}
                                >
                                    Register
                                </StyledBtn>
                            </Row>
                            {this.voteStatus()}

                        </>
                        <MainArea>
                            <Candidates />
                            <HistoryArea>
                                <History />
                                <Spnosor />
                                <Refund />
                            </HistoryArea>
                        </MainArea>
                    </>
                )}
            </>
        );
    }

    private voteStatus() {
        return (
            <State>
                {(voteService.isVoting !== undefined) && (
                    (voteService.isVoting)
                    ? <Keyword>Voting time!</Keyword>
                    : <><Keyword>Register now!</Keyword> Guarantee Deposit Fee: <Keyword>${voteService.guaranteeDepositInDex}</Keyword> DEX</>
                )}
                {!voteService.isVoting && ('')}
            </State>
        );
    }
}

const AppMain = <Main />;

export { AppMain };
