import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Container, Header } from '@/components/Mux';
import LotteryContract from '@/services/Lottery';

import LotteryItem from './LotteryItem';
import EmptyItem from './EmptyItem';

const StretchedContainer = styled(Container)`
  flex: 1 1 auto;
`;

const Body = styled.div`
  overflow: auto;
  position: absolute;
  height: calc(100% - 30px);
  width: calc(100% - 40px);
  display: block;
`;

// eslint-disable-next-line react/prefer-stateless-function
class Console extends PureComponent {
  state = {
    list: [],
  };

  componentDidMount() {
    // this.updateList();
    // setInterval(this.updateList, 10000);
  }

  setBodyRef = (ref) => {
    this.body = ref;

    this.scrollToBottom();
  };

  updateList = () => {
    LotteryContract.getPastEvents('NumberRevealed', {
      fromBlock: 0,
      toBlock: 'latest',
    })
      .then(events => this.setState({
        list: events,
      }, this.scrollToBottom));
  }

  scrollToBottom = () => {
    if (!this.body) return;

    this.body.scrollTop = this.body.offsetHeight;
  }

  render() {
    const { list } = this.state;

    return (
      <StretchedContainer>
        <Header>
          Lottery History
        </Header>

        <Body innerRef={this.setBodyRef}>
          {list.map(event => (
            <LotteryItem
              key={event.transactionHash}
              hash={event.transactionHash}
              timestamp={event.returnValues[0]}
              number={`00${event.returnValues[1]}`.slice(-3)}
              rawValue={event.returnValues[2]}
            />
          ))}

          {!list.length && <EmptyItem />}
        </Body>
      </StretchedContainer>
    );
  }
}

export default Console;
