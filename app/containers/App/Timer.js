
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Container, Header } from '@/components/Mux';

const LAUNCH_TIME = 1556164800000;
const Time = styled.div`
  font-size: 72px;
`;
const pad = number => `0${number}`.slice(-2);

class Timer extends PureComponent {
  state = {
    duration: LAUNCH_TIME - Date.now(),
  };

  componentDidMount() {
    setInterval(this.updateTime, 1000);
  }

  updateTime = () => {
    this.setState({ duration: LAUNCH_TIME - Date.now() });
  }

  render() {
    const duration = moment.duration(this.state.duration);

    return (
      <Container>
        <Header>
          Time Until DEXON Mainnet Launch
        </Header>

        <Time>
          {(duration.days() * 24) + duration.hours()}:{pad(duration.minutes())}:{pad(duration.seconds())}
        </Time>
      </Container>
    );
  }
}

export default Timer;
