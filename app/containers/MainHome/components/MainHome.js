/*
 * MainHome
 *
 * List all the features
 */
import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed,
} from 'bip39';
import hdkey from 'ethereumjs-wallet/hdkey';
import { pubToAddress, toChecksumAddress } from 'ethereumjs-util';

import Input from '@/components/Input';
import Button from '@/components/Button';

const Wrapper = styled.main`
  max-width: 830px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 15px;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const Logo = styled.div`
  width: 45px;
  height: 80px;
  margin: 0 auto;
  border-top: 40px solid black; 
  border-bottom: 40px solid black; 
  border-left: 22.49px solid white; 
  border-right: 22.49px solid white; 
`;

const Step = styled.div`
  margin-top: 30px;
  width: 100%;
`;

const StepNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #5E6C75;
`;

const StepTitle = styled.h1`
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 36px;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  margin-top: 15px;
`;

const activeStyle = css`
  border-color: #954a97;
  background-color: rgba(126, 121, 146, 0.1);
`;

const dimStyle = css`
  color: #d8d8d8;
  border-color: #d8d8d8;
`;

const StyledButton = styled(Button)`
  height: 100%;
  font-size: 16px;
  flex: 1 0 50px;
  transition: .2s color, .2s background-color, .2s border-color;

  &:not(:first-child) {
    margin-left: 10px;
  }

  ${props => props.isActive && activeStyle};
  ${props => props.isDim && dimStyle};
`;

const StyledInput = styled(Input)`
  max-width: 800px;
  margin: 20px 0;
`;

const Hint = styled.p`
  color: #5E6C75;
  font-size: 16px;
`;

const Warning = Hint.extend`
  color: #FF435A;
`;

const UlHead = Hint.extend`
  margin-bottom: 0;
  font-weight: 700;
`;

const Ul = styled.ul`
  margin-top: 0;
  color: #5E6C75;
`;

const mnemonicValidators = [
  {
    test: input => validateMnemonic(input),
    message: 'Invalid mnemonic phrases',
  },
  {
    test: input => input.split(' ').length === 24,
    message: 'Should be 24 words in total',
  },
  {
    test: input => /^[a-z\s]*$/.test(input),
    message: 'Words are separated by single space',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class MainHome extends PureComponent {
  state = {
    hasLedger: 'unknown',
    mnemonic: '',
    step2Confirmed: false,
    hdWallet: null,
    address: '',
  };

  handleSelect = hasLedger =>
    this.setState({
      hasLedger,
      step2Confirmed: false,
      mnemonic: hasLedger === 'yes' ? '' : generateMnemonic(256),
      address: '',
    }, this.handleProcessMnemonic);

  handleMnemonicChange = event =>
    this.setState({
      mnemonic: event.target.value,
      step2Confirmed: validateMnemonic(event.target.value),
    }, this.handleProcessMnemonic);

  handleConfirmStep2 = () =>
    this.setState({
      step2Confirmed: true,
    }, () => window.scrollTo(0, document.body.scrollHeight));

  handleProcessMnemonic = () => {
    const { mnemonic } = this.state;

    if (!validateMnemonic(mnemonic)) {
      return;
    }

    const seed = mnemonicToSeed(mnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const key = hdWallet.derivePath('m/44\'/237\'/0\'/0/0');
    const addressInt = pubToAddress(key._hdkey._publicKey, true); // eslint-disable-line no-underscore-dangle
    const address = toChecksumAddress(addressInt.toString('hex'));

    this.setState({
      address,
    }, () => window.scrollTo(0, document.body.scrollHeight));
  }

  render() {
    const { hasLedger, mnemonic, step2Confirmed, address } = this.state;

    return (
      <Wrapper>
        <Logo />

        <Step>
          <StepTitle>
            <StepNumber>Step 1</StepNumber>
            Do you have a Ledger wallet already?
          </StepTitle>

          <ButtonGroup>
            <StyledButton
              isSecondary
              isActive={hasLedger === 'yes'}
              isDim={hasLedger === 'no'}
              onClick={() => this.handleSelect('yes')}
            >
              Yes
            </StyledButton>

            <StyledButton
              isSecondary
              isActive={hasLedger === 'no'}
              isDim={hasLedger === 'yes'}
              onClick={() => this.handleSelect('no')}
            >
              No
            </StyledButton>
          </ButtonGroup>
        </Step>

        {hasLedger === 'yes' && <Step>
          <StepTitle>
            <StepNumber>Step 2</StepNumber>
            Fill in your Ledger recovery phrases
          </StepTitle>

          <StyledInput
            isMultiline
            isOptional
            value={mnemonic}
            validators={mnemonicValidators}
            placeholder="Input your 24 recovery phrases separated by single space."
            onChange={this.handleMnemonicChange}
          />

          <Warning>
            <b>WARNING: DO NOT do this on a public computer.</b>
            <br />
            If anyone gets your recovery phrases, they will have FULL ACCESS to your accounts.
          </Warning>
        </Step>}

        {hasLedger === 'no' && <Step>
          <StepTitle>
            <StepNumber>Step 2</StepNumber>
            Backup your Ledger recovery phrases
          </StepTitle>

          <StyledInput
            isMultiline
            isOptional
            readOnly
            value={mnemonic}
          />

          <Hint>
            These 24 randomly generated recovery phrases are the keys to your accounts.
            <br />
            You must <b>keep them safe</b>.
          </Hint>

          <Warning>
            <b>WARNING 1: DO NOT disclose these phrases to anyone, including anyone from DEXON Foundation.</b>
            <br />
            If anyone gets your recovery phrases, they will have FULL ACCESS to your accounts.
          </Warning>

          <Warning>
            <b>WARNING 2: DO NOT lose these phrases.</b>
            <br />
            If you lose them, NOBODY, not even DEXON Foundation, can regain access to your accounts.
          </Warning>

          <UlHead>You SHOULD either:</UlHead>
          <Ul>
            <li>Write them down on a piece of paper, or</li>
            <li>Store them encrypted in your computer.</li>
          </Ul>

          <UlHead>You SHOULD NOT:</UlHead>
          <Ul>
            <li>Send them through email or online messengers, or</li>
            <li>Store them online, or</li>
            <li>Access them on a public computer.</li>
          </Ul>

          <ButtonGroup>
            <StyledButton
              isSecondary
              isActive={step2Confirmed}
              onClick={this.handleConfirmStep2}
            >
              I have safely stored my recovery phrases
            </StyledButton>
          </ButtonGroup>
        </Step>}

        {step2Confirmed && <Step>
          <StepTitle>
            <StepNumber>Final Step</StepNumber>
            Send your account address to DEXON Foundation
          </StepTitle>

          <StyledInput
            isMultiline
            isOptional
            readOnly
            height={52}
            value={address}
          />

          <Hint>
            No worries. You can tell whoever you like about your account address. There is no security risk in doing so.
          </Hint>
        </Step>}
      </Wrapper>
    );
  }
}

export default MainHome;
