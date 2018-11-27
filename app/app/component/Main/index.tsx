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

const StyledBtn = styled.button``;
const Row = styled.div`
    display: flex;
    justify-content: center;
`;
const MainArea = styled.div`
    flex: 1;
    display: flex;
    border: 1px solid red;
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
                        <InputArea />

                        {voteService.contractDataLoaded && (
                            <>
                                <Row>
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
                        )}
                        <MainArea>
                            <Candidates />
                            <History />
                            <Spnosor />
                            <Refund />
                        </MainArea>
                    </>
                )}
            </>
        );
    }

    private voteStatus() {
        return (
            <div>
                {(voteService.isVoting !== undefined) && (
                    (voteService.isVoting)
                    ? 'Voting!'
                    : `Register now, deposit fee: ${voteService.guaranteedDeposit}`
                )}
            </div>
        );
    }
}

const AppMain = <Main />;

export { AppMain };
