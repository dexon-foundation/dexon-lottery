
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Container, Header } from '@/components/Mux';
import { times } from '../../../constants';

const LAUNCH_TIME = 1556164800000;

const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 0 5px;
`;

const StretchedContainer = styled(Container)`
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
`;

const Time = styled.div`
  font-size: 60px;
`;

const pad = number => `0${number}`.slice(-2);
const findNext = () => times.find(time => time * 1000 > Date.now()) * 1000 || 0;

class Timer extends PureComponent {
  state = {
    mainnetDuration: LAUNCH_TIME - Date.now(),
    drawDuration: findNext() - Date.now(),
  };

  componentDidMount() {
    setInterval(this.updateTime, 1000);
  }

  updateTime = () => {
    const nextTime = findNext();

    this.setState({
      mainnetDuration: LAUNCH_TIME - Date.now(),
      drawDuration: nextTime - Date.now(),
    });
  }

  render() {
    const { mainnetDuration, drawDuration } = this.state;

    const mainnetDurationDisplay = moment.duration(mainnetDuration);
    const drawDurationDisplay = moment.duration(drawDuration);

    return (
      <HorizontalContainer>
        <StretchedContainer>
          <Header>
            Time Until DEXON Mainnet Launch
          </Header>

          <Time>
            {(mainnetDurationDisplay.days() * 24) + mainnetDurationDisplay.hours()}:{pad(mainnetDurationDisplay.minutes())}:{pad(mainnetDurationDisplay.seconds())}
          </Time>
        </StretchedContainer>

        <StretchedContainer>
          <Header>
            Time Until Next Lucky Draw
          </Header>

          <Time>
            {(drawDurationDisplay.days() * 24) + drawDurationDisplay.hours()}:{pad(drawDurationDisplay.minutes())}:{pad(drawDurationDisplay.seconds())}
          </Time>
        </StretchedContainer>
      </HorizontalContainer>
    );
  }
}

export default Timer;
